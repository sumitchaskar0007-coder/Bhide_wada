import express from 'express'
import cors from 'cors'
import multer from 'multer'
import {mkdirSync,existsSync} from 'node:fs'
import {open,rename,unlink} from 'node:fs/promises'
import {resolve,join} from 'node:path'
import {randomUUID,randomBytes,createHash} from 'node:crypto'
import {openStore,hashPassword,verifyPassword} from './store.js'

const types=['announcements','news','events','gallery','hero']
const fields={announcements:['title','summary','content','link','expiresAt'],news:['title','summary','content'],events:['title','summary','content','date','location'],gallery:['title','description'],hero:['title','altText']}
const sha=value=>createHash('sha256').update(value).digest('hex')
const fail=(status,message)=>Object.assign(new Error(message),{status})
const now=()=>new Date().toISOString()
const bool=(value,fallback)=>value===undefined?fallback:value===true||value==='true'
const parse=row=>JSON.parse(row.payload)
function safeLink(value){
  if(/[\u0000-\u0020\u007f]/.test(value))throw fail(400,'Links cannot contain spaces or control characters.')
  if(value.startsWith('/')&&!value.startsWith('//')&&!value.includes('\\'))return value
  try{const url=new URL(value);if(url.protocol==='https:'&&!url.username&&!url.password)return url.href}catch{}
  throw fail(400,'Use an HTTPS URL or a website path beginning with /.')
}
function externalMedia(value,resourceType){
  let url
  try{url=new URL(value)}catch{throw fail(400,'Enter a valid public HTTPS media URL.')}
  if(url.protocol!=='https:'||url.username||url.password)throw fail(400,'Media URLs must use HTTPS without credentials.')
  const youtubeHosts=['youtube.com','www.youtube.com','m.youtube.com','youtu.be','www.youtube-nocookie.com']
  if(youtubeHosts.includes(url.hostname)){
    const id=url.hostname==='youtu.be'?url.pathname.slice(1):url.searchParams.get('v')||url.pathname.split('/').filter(Boolean).at(-1)
    if(!/^[\w-]{11}$/.test(id||''))throw fail(400,'Enter a valid YouTube video URL.')
    return {mediaUrl:`https://www.youtube-nocookie.com/embed/${id}`,mediaResourceType:'video',mediaProvider:'youtube'}
  }
  if(!['image','video'].includes(resourceType))throw fail(400,'Choose image or video for this URL.')
  return {mediaUrl:url.href,mediaResourceType:resourceType,mediaProvider:'external'}
}
async function inspectMedia(file,hero){
  const handle=await open(file.path,'r')
  const bytes=Buffer.alloc(32)
  try{await handle.read(bytes,0,32,0)}finally{await handle.close()}
  let kind
  if(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))kind=['png','image','image/png']
  else if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)kind=['jpg','image','image/jpeg']
  else if(/^GIF8[79]a/.test(bytes.toString('ascii',0,6)))kind=['gif','image','image/gif']
  else if(bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP')kind=['webp','image','image/webp']
  else if(bytes.toString('ascii',4,8)==='ftyp'&&['isom','iso2','mp41','mp42','avc1','M4V ','qt  '].includes(bytes.toString('ascii',8,12)))kind=['mp4','video','video/mp4']
  else if(bytes.subarray(0,4).equals(Buffer.from([26,69,223,163])))kind=['webm','video','video/webm']
  if(!kind||(hero&&kind[1]!=='image')||file.mimetype!==kind[2])throw fail(400,hero?'Upload a valid PNG, JPEG, WebP or GIF image.':'Upload a valid PNG, JPEG, WebP, GIF, MP4 or WebM file matching its file type.')
  return kind
}

export async function createApp({dataDir=resolve('.data'),origins=['http://127.0.0.1:5173','http://127.0.0.1:5174','http://localhost:5173','http://localhost:5174'],production=false,serveFrontend=false,maxUploadMB=50}={}){
  const {db,transaction,audit}=openStore(join(dataDir,'admin.sqlite'))
  const uploads=join(dataDir,'uploads')
  mkdirSync(uploads,{recursive:true,mode:0o700})
  const app=express()
  app.disable('x-powered-by')
  app.use((req,res,next)=>{
    res.set({'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'camera=(), microphone=(), geolocation=()'})
    if(production)res.set('Strict-Transport-Security','max-age=31536000')
    next()
  })
  app.use(cors({origin:(origin,done)=>done(null,!origin||origins.includes(origin)),credentials:true}))
  app.use('/api',(req,res,next)=>{
    res.set('Cache-Control','no-store')
    if(!['GET','HEAD','OPTIONS'].includes(req.method)&&!origins.includes(req.get('origin')))return next(fail(403,'This request origin is not allowed.'))
    next()
  })
  app.use(express.json({limit:'128kb'}))
  const upload=multer({dest:uploads,limits:{fileSize:maxUploadMB*1024*1024,files:1,fields:20,fieldSize:20000},fileFilter:(req,file,done)=>{
    const allowed=['image/png','image/jpeg','image/webp','image/gif','video/mp4','video/webm']
    done(allowed.includes(file.mimetype)?null:fail(400,'Supported media: PNG, JPEG, WebP, GIF, MP4 and WebM.'),allowed.includes(file.mimetype))
  }})
  const cookieName='bw_session'
  const cookieOptions={httpOnly:true,secure:production,sameSite:'lax',path:'/api',maxAge:8*60*60*1000}
  const readToken=req=>{
    const value=(req.headers.cookie||'').split(';').map(v=>v.trim()).find(v=>v.startsWith(`${cookieName}=`))?.slice(cookieName.length+1)
    return /^[a-f0-9]{64}$/.test(value||'')?value:''
  }
  const session=req=>{
    const token=readToken(req)
    return token?db.prepare('SELECT admins.id, admins.username FROM sessions JOIN admins ON admins.id=sessions.admin_id WHERE token=? AND expires>?').get(sha(token),Date.now()):null
  }
  const requireAdmin=(req,res,next)=>{
    const admin=session(req)
    if(!admin)return next(fail(401,'Your session has expired. Please sign in.'))
    req.admin=admin;next()
  }
  const issueSession=(admin,res)=>{
    const token=randomBytes(32).toString('hex')
    db.prepare('DELETE FROM sessions WHERE expires<=?').run(Date.now())
    db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(sha(token),admin.id,Date.now()+cookieOptions.maxAge)
    res.cookie(cookieName,token,cookieOptions)
  }
  const attempts=new Map()
  const limited=(key,max,windowMS)=>{
    const time=Date.now()
    for(const [id,entry] of attempts)if(entry.until<=time)attempts.delete(id)
    const entry=attempts.get(key)||{count:0,until:time+windowMS}
    entry.count++;attempts.set(key,entry)
    if(entry.count>max)throw fail(429,'Too many attempts. Please try again later.')
  }
  const dummyHash=await hashPassword(randomBytes(32).toString('hex'))
  app.get('/api/health',(req,res)=>res.json({status:'ok'}))
  app.get('/api/admin/session',(req,res)=>{
    const admin=session(req)
    res.json({authenticated:Boolean(admin),user:admin?{username:admin.username}:null})
  })
  app.post('/api/admin/login',async(req,res)=>{
    limited(`login:${req.ip}`,10,15*60*1000)
    const {username,password}=req.body||{}
    if(typeof username!=='string'||typeof password!=='string'||username.length>80||password.length>256)throw fail(400,'Enter a valid username and password.')
    const admin=db.prepare('SELECT * FROM admins WHERE username=?').get(username.trim())
    const correct=await verifyPassword(password,admin?.password||dummyHash)
    if(!admin||!correct)throw fail(401,'Invalid username or password.')
    issueSession(admin,res)
    audit(admin.username,'signed in','account','Admin login')
    res.json({authenticated:true,user:{username:admin.username}})
  })
  app.post('/api/admin/logout',requireAdmin,(req,res)=>{
    db.prepare('DELETE FROM sessions WHERE token=?').run(sha(readToken(req)))
    res.clearCookie(cookieName,{...cookieOptions,maxAge:undefined})
    res.json({message:'Signed out.'})
  })
  app.post('/api/admin/password',requireAdmin,async(req,res)=>{
    limited(`password:${req.admin.id}`,10,15*60*1000)
    const {currentPassword,newPassword}=req.body||{}
    if(typeof newPassword!=='string'||newPassword.length<14||newPassword.length>256)throw fail(400,'Use a new password between 14 and 256 characters.')
    const admin=db.prepare('SELECT * FROM admins WHERE id=?').get(req.admin.id)
    if(!await verifyPassword(currentPassword,admin.password))throw fail(400,'Current password is incorrect.')
    if(currentPassword===newPassword)throw fail(400,'Choose a different password.')
    const hashed=await hashPassword(newPassword)
    transaction(()=>{
      db.prepare('UPDATE admins SET password=? WHERE id=?').run(hashed,admin.id)
      db.prepare('DELETE FROM sessions WHERE admin_id=?').run(admin.id)
      audit(admin.username,'changed password','account','Password changed; previous sessions revoked')
    })
    issueSession(admin,res)
    res.json({message:'Password changed. Other sessions have been signed out.'})
  })
  const list=type=>db.prepare('SELECT payload FROM content WHERE type=? ORDER BY rowid DESC').all(type).map(parse)
  app.get('/api/admin/overview',requireAdmin,(req,res)=>{
    const counts=Object.fromEntries(types.map(type=>{const items=list(type);return [type,{total:items.length,published:items.filter(item=>item.published&&(type!=='hero'||item.active)).length}]}))
    const enquiries=db.prepare('SELECT payload FROM enquiries').all().map(parse)
    res.json({counts,enquiries:{total:enquiries.length,unread:enquiries.filter(item=>item.status==='new').length},activity:db.prepare('SELECT id,actor,action,section,title,created_at AS createdAt FROM activity ORDER BY rowid DESC LIMIT 20').all(),user:{username:req.admin.username}})
  })
  app.get('/api/admin/enquiries',requireAdmin,(req,res)=>res.json({items:db.prepare('SELECT payload FROM enquiries ORDER BY rowid DESC').all().map(parse)}))
  app.patch('/api/admin/enquiries/:id',requireAdmin,(req,res)=>{
    const row=db.prepare('SELECT payload FROM enquiries WHERE id=?').get(req.params.id)
    if(!row)throw fail(404,'Enquiry not found.')
    if(!['new','read','resolved'].includes(req.body?.status))throw fail(400,'Choose a valid enquiry status.')
    const item={...parse(row),status:req.body.status,updatedAt:now()}
    transaction(()=>{db.prepare('UPDATE enquiries SET payload=? WHERE id=?').run(JSON.stringify(item),item._id);audit(req.admin.username,'updated','enquiries',item.name)})
    res.json({item})
  })
  app.delete('/api/admin/enquiries/:id',requireAdmin,(req,res)=>{
    const row=db.prepare('SELECT payload FROM enquiries WHERE id=?').get(req.params.id)
    if(!row)throw fail(404,'Enquiry not found.')
    transaction(()=>{db.prepare('DELETE FROM enquiries WHERE id=?').run(req.params.id);audit(req.admin.username,'deleted','enquiries',parse(row).name)})
    res.json({message:'Enquiry deleted.'})
  })
  app.post('/api/enquiries',(req,res)=>{
    limited(`contact:${req.ip}`,5,15*60*1000)
    const body=req.body||{}
    const item=Object.fromEntries(['name','phone','email','message'].map(field=>[field,typeof body[field]==='string'?body[field].trim():'']))
    if(item.name.length<2||item.name.length>100||(!/^\+?[\d ()-]{7,20}$/.test(item.phone)||item.phone.replace(/\D/g,'').length<7||item.phone.replace(/\D/g,'').length>15)||item.email.length>254||(item.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email))||item.message.length>5000)throw fail(400,'Enter a name, valid phone number, and valid email if provided. Keep the message under 5000 characters.')
    Object.assign(item,{_id:randomUUID(),status:'new',createdAt:now()})
    db.prepare('INSERT INTO enquiries VALUES(?,?)').run(item._id,JSON.stringify(item))
    res.status(201).json({message:'Your enquiry has been received.'})
  })
  app.get('/api/media/:filename',(req,res,next)=>{
    if(!/^[a-f0-9-]{36}\.(png|jpg|gif|webp|mp4|webm)$/.test(req.params.filename))return next(fail(404,'Media not found.'))
    res.set('Cache-Control','public, max-age=86400')
    res.sendFile(req.params.filename,{root:uploads},error=>{if(error&&!res.headersSent)next(fail(error.status||500,'Media not found.'))})
  })
  const validateType=(req,res,next)=>types.includes(req.params.type)?next():next(fail(404,'Content section not found.'))
  app.get('/api/:type',validateType,(req,res)=>res.json({items:list(req.params.type).filter(item=>item.published&&(req.params.type!=='hero'||item.active)&&(!item.expiresAt||new Date(item.expiresAt)>new Date())).sort((a,b)=>Number(b.pinned||false)-Number(a.pinned||false))}))
  app.get('/api/admin/:type',requireAdmin,validateType,(req,res)=>res.json({items:list(req.params.type)}))
  const cleanup=async url=>{
    if(typeof url==='string'&&/^\/api\/media\/[a-f0-9-]{36}\.(png|jpg|gif|webp|mp4|webm)$/.test(url))await unlink(join(uploads,url.split('/').at(-1))).catch(error=>{if(error.code!=='ENOENT')console.error('Media cleanup failed:',error.code)})
  }
  const save=async(req,res)=>{
    let mediaURL
    try{
      const type=req.params.type
      let old
      if(req.params.id){const row=db.prepare('SELECT payload FROM content WHERE id=? AND type=?').get(req.params.id,type);if(!row)throw fail(404,'Record not found.');old=parse(row)}
      const body=req.body||{}
      const data={}
      for(const field of fields[type]){
        const value=body[field]===undefined?old?.[field]||'':body[field]
        if(typeof value!=='string')throw fail(400,`${field} must be text.`)
        const max=field==='content'?10000:field==='summary'?500:field==='title'?200:1000
        if(value.length>max)throw fail(400,`${field} is too long (maximum ${max} characters).`)
        data[field]=value.trim()
      }
      if(!data.title)throw fail(400,'Title is required.')
      if(type==='hero'&&!data.altText)throw fail(400,'Alternative text is required.')
      if(type==='events'){
        if(!data.date||Number.isNaN(Date.parse(data.date))||!data.location)throw fail(400,'A valid event date and location are required.')
        data.date=new Date(data.date).toISOString()
      }
      if(data.link)data.link=safeLink(data.link)
      if(data.expiresAt){if(Number.isNaN(Date.parse(data.expiresAt)))throw fail(400,'Choose a valid expiry date.');data.expiresAt=new Date(data.expiresAt).toISOString()}
      data.published=bool(body.published,old?.published??true)
      if(type==='hero')data.active=bool(body.active,old?.active??true)
      if(type==='announcements')data.pinned=bool(body.pinned,old?.pinned??false)
      let media=old?Object.fromEntries(['mediaUrl','mediaResourceType','mediaProvider'].filter(key=>old[key]).map(key=>[key,old[key]])):{}
      if(req.file){
        const [extension,resource]=await inspectMedia(req.file,type==='hero')
        const filename=`${randomUUID()}.${extension}`
        await rename(req.file.path,join(uploads,filename))
        mediaURL=`/api/media/${filename}`
        media={mediaUrl:mediaURL,mediaResourceType:resource,mediaProvider:'local'}
      }else if(body.mediaSourceUrl){media=externalMedia(body.mediaSourceUrl,body.mediaSourceType)}
      if(['hero','gallery'].includes(type)&&!media.mediaUrl)throw fail(400,'An image or video is required.')
      if(type==='hero'&&media.mediaResourceType!=='image')throw fail(400,'Hero slides must be images.')
      const item={...data,...media,_id:old?._id||randomUUID(),createdAt:old?.createdAt||now(),updatedAt:now()}
      transaction(()=>{
        db.prepare('INSERT INTO content VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload').run(item._id,type,JSON.stringify(item))
        audit(req.admin.username,old?'updated':'created',type,item.title)
      })
      if(old?.mediaUrl!==item.mediaUrl)await cleanup(old?.mediaUrl)
      res.status(old?200:201).json({item})
    }catch(error){
      if(mediaURL)await cleanup(mediaURL)
      if(req.file)await unlink(req.file.path).catch(()=>{})
      throw error
    }
  }
  app.post('/api/admin/:type',requireAdmin,validateType,upload.single('media'),save)
  app.put('/api/admin/:type/:id',requireAdmin,validateType,upload.single('media'),save)
  app.delete('/api/admin/:type/:id',requireAdmin,validateType,async(req,res)=>{
    const row=db.prepare('SELECT payload FROM content WHERE id=? AND type=?').get(req.params.id,req.params.type)
    if(!row)throw fail(404,'Record not found.')
    const item=parse(row)
    transaction(()=>{db.prepare('DELETE FROM content WHERE id=?').run(item._id);audit(req.admin.username,'deleted',req.params.type,item.title)})
    await cleanup(item.mediaUrl)
    res.json({message:'Record deleted.'})
  })
  app.use('/api',(req,res,next)=>next(fail(404,'API endpoint not found.')))
  const dist=resolve('dist')
  if(serveFrontend&&existsSync(join(dist,'index.html'))){
    app.use(express.static(dist))
    app.get('/{*path}',(req,res)=>res.sendFile(join(dist,'index.html')))
  }
  app.use((error,req,res,next)=>{
    if(res.headersSent)return next(error)
    const status=error instanceof multer.MulterError?400:error.status||500
    if(status>=500)console.error('Server error:',error.message)
    res.status(status).json({message:error instanceof multer.MulterError?(error.code==='LIMIT_FILE_SIZE'?`Media must be under ${maxUploadMB} MB.`:'Invalid upload. Choose one media file.'):status>=500?'The server could not complete your request.':error.message})
  })
  return {app,db}
}
