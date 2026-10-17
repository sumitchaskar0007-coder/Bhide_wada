import {test,before,after} from 'node:test'
import assert from 'node:assert/strict'
import {mkdtemp,rm,readdir} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {once} from 'node:events'
import {randomUUID} from 'node:crypto'
import {createApp} from '../bhide_wada_backend/app.js'
import {hashPassword,verifyPassword,openStore} from '../bhide_wada_backend/store.js'

const origin='http://127.0.0.1:5174'
const initialPassword='Local-test-password-2026!'
let directory,db,server,base,cookie,newsId
async function call(path,{method='GET',body,auth=true,requestOrigin=origin,headers={}}={}){
  const options={method,headers:{Origin:requestOrigin,...(auth&&cookie?{Cookie:cookie}:{}),...headers}}
  if(body instanceof FormData)options.body=body
  else if(body!==undefined){options.body=JSON.stringify(body);options.headers['Content-Type']='application/json'}
  const response=await fetch(`${base}/api${path}`,options)
  const data=await response.json().catch(()=>null)
  return {response,data}
}
async function login(password=initialPassword){
  const result=await call('/admin/login',{method:'POST',auth:false,body:{username:'admin',password}})
  if(result.response.ok)cookie=result.response.headers.get('set-cookie').split(';')[0]
  return result
}
function form(values,file){
  const data=new FormData()
  for(const [key,value] of Object.entries(values))data.append(key,String(value))
  if(file)data.append('media',new Blob([file.bytes],{type:file.type}),file.name)
  return data
}
before(async()=>{
  directory=await mkdtemp(join(tmpdir(),'bhide-admin-test-'))
  const result=await createApp({dataDir:directory,origins:[origin],maxUploadMB:1})
  db=result.db
  db.prepare('INSERT INTO admins VALUES(?,?,?)').run(randomUUID(),'admin',await hashPassword(initialPassword))
  server=result.app.listen(0,'127.0.0.1')
  await once(server,'listening')
  base=`http://127.0.0.1:${server.address().port}`
})
after(async()=>{if(server)await new Promise(resolve=>server.close(resolve));db?.close();if(directory)await rm(directory,{recursive:true,force:true})})

test('public health works; content and administrative endpoints require authentication',async()=>{
  assert.equal((await call('/health',{auth:false})).data.status,'ok')
  for(const path of ['/admin/overview','/admin/news','/admin/announcements','/admin/gallery','/admin/enquiries'])assert.equal((await call(path,{auth:false})).response.status,401)
  assert.equal((await call('/admin/news',{method:'POST',auth:false,body:{title:'Unauthorized'}})).response.status,401)
  assert.equal((await call('/admin/news/missing',{method:'PUT',auth:false,body:{title:'Unauthorized'}})).response.status,401)
  assert.equal((await call('/admin/news/missing',{method:'DELETE',auth:false})).response.status,401)
  assert.equal((await call('/admin/session',{auth:false})).data.authenticated,false)
})
test('login rejects untrusted origins and wrong passwords; sets an HTTP-only cookie',async()=>{
  assert.equal((await call('/admin/login',{method:'POST',requestOrigin:'https://untrusted.example',auth:false,body:{username:'admin',password:initialPassword}})).response.status,403)
  assert.equal((await login('wrong-password')).response.status,401)
  const {response}=await login()
  assert.equal(response.status,200)
  const raw=response.headers.get('set-cookie')
  assert.match(raw,/HttpOnly/)
  assert.match(raw,/SameSite=Lax/)
  assert.match(raw,/Path=\/api/)
  assert.equal((await call('/admin/session')).data.authenticated,true)
  const stored=db.prepare('SELECT token FROM sessions').get().token
  assert.notEqual(stored,cookie.split('=')[1])
  assert.equal(db.prepare('SELECT password FROM admins').get().password.includes(initialPassword),false)
})
test('news CRUD validates input, separates drafts from published content and records activity',async()=>{
  assert.equal((await call('/admin/news',{method:'POST',body:{title:''}})).response.status,400)
  assert.equal((await call('/admin/news',{method:'POST',body:{title:'x'.repeat(201)}})).response.status,400)
  const created=await call('/admin/news',{method:'POST',body:form({title:'पहिली बातमी',summary:'News summary',content:'Committee update',published:false})})
  assert.equal(created.response.status,201)
  newsId=created.data.item._id
  assert.equal((await call('/news',{auth:false})).data.items.length,0)
  assert.equal((await call('/admin/news')).data.items.length,1)
  const updated=await call(`/admin/news/${newsId}`,{method:'PUT',body:form({title:'Published news',published:true})})
  assert.equal(updated.response.status,200)
  assert.equal(updated.data.item.content,'Committee update')
  assert.equal((await call('/news',{auth:false})).data.items[0].title,'Published news')
  assert.equal((await call(`/admin/news/${newsId}`,{method:'PUT',requestOrigin:'https://untrusted.example',body:{title:'Forged'}})).response.status,403)
  assert.equal((await call(`/admin/gallery/${newsId}`,{method:'DELETE'})).response.status,404)
})
test('announcements support publication, pinning, expiry and safe links',async()=>{
  const create=body=>call('/admin/announcements',{method:'POST',body})
  assert.equal((await create({title:'Bad URL',link:'javascript:alert(1)'})).response.status,400)
  assert.equal((await create({title:'Bad URL',link:'//evil.example'})).response.status,400)
  assert.equal((await create({title:'Bad URL',link:'/\n/evil.example'})).response.status,400)
  assert.equal((await create({title:'Bad expiry',expiresAt:'not-a-date'})).response.status,400)
  await create({title:'Expired notice',expiresAt:'2020-01-01T00:00:00Z',published:true})
  await create({title:'Pinned notice',content:'Pinned details',pinned:true,link:'/projects',published:true})
  await create({title:'Normal notice',published:true})
  await create({title:'Draft notice',published:false})
  const items=(await call('/announcements',{auth:false})).data.items
  assert.deepEqual(items.map(item=>item.title),['Pinned notice','Normal notice'])
})
test('events require valid dates and locations',async()=>{
  assert.equal((await call('/admin/events',{method:'POST',body:{title:'Event',date:'invalid',location:'Pune'}})).response.status,400)
  const result=await call('/admin/events',{method:'POST',body:form({title:'Community meeting',date:'2026-12-01T10:00:00+05:30',location:'Pune',published:true})})
  assert.equal(result.response.status,201)
  assert.equal((await call('/events',{auth:false})).data.items[0].date,'2026-12-01T04:30:00.000Z')
})
test('gallery supports validated uploads, replacements, cleanup and media URLs',async()=>{
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jS1kAAAAASUVORK5CYII=','base64')
  const file={bytes:png,type:'image/png',name:'test.png'}
  const invalid=await call('/admin/gallery',{method:'POST',body:form({title:'Fake image'},{bytes:'<script>alert(1)</script>',type:'image/png',name:'fake.png'})})
  assert.equal(invalid.response.status,400)
  assert.equal((await readdir(join(directory,'uploads'))).length,0)
  const oversized=await call('/admin/gallery',{method:'POST',body:form({title:'Too large'},{bytes:Buffer.alloc(1024*1024+1),type:'image/png',name:'large.png'})})
  assert.equal(oversized.response.status,400)
  const created=await call('/admin/gallery',{method:'POST',body:form({title:'Gallery photo',description:'A photo',published:true},file)})
  assert.equal(created.response.status,201)
  const media=await fetch(`${base}${created.data.item.mediaUrl}`)
  assert.equal(media.status,200)
  assert.equal(media.headers.get('content-type'),'image/png')
  assert.equal(media.headers.get('x-content-type-options'),'nosniff')
  const updated=await call(`/admin/gallery/${created.data.item._id}`,{method:'PUT',body:form({title:'Replacement'},file)})
  assert.equal(updated.response.status,200)
  assert.equal((await fetch(`${base}${created.data.item.mediaUrl}`)).status,404)
  assert.equal((await readdir(join(directory,'uploads'))).length,1)
  assert.equal((await call(`/admin/gallery/${created.data.item._id}`,{method:'DELETE'})).response.status,200)
  assert.equal((await readdir(join(directory,'uploads'))).length,0)
  const youtube=await call('/admin/gallery',{method:'POST',body:form({title:'Video',mediaSourceUrl:'https://www.youtube.com/watch?v=dQw4w9WgXcQ',mediaSourceType:'video'})})
  assert.equal(youtube.response.status,201)
  assert.equal(youtube.data.item.mediaUrl,'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')
  assert.equal((await call('/admin/gallery',{method:'POST',body:{title:'Invalid URL',mediaSourceUrl:'http://example.com/file.png',mediaSourceType:'image'}})).response.status,400)
  assert.equal((await call('/admin/gallery',{method:'POST',body:{title:'Missing media'}})).response.status,400)
})
test('inactive hero images are hidden; editing preserves explicit flags',async()=>{
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jS1kAAAAASUVORK5CYII=','base64')
  const created=await call('/admin/hero',{method:'POST',body:form({title:'Hero slide',altText:'Memorial',active:false,published:true},{bytes:png,type:'image/png',name:'hero.png'})})
  assert.equal(created.response.status,201)
  assert.equal((await call('/hero',{auth:false})).data.items.length,0)
  await call(`/admin/hero/${created.data.item._id}`,{method:'PUT',body:{title:'Edited hero'}})
  assert.equal((await call('/hero',{auth:false})).data.items.length,0)
  await call(`/admin/hero/${created.data.item._id}`,{method:'PUT',body:{active:true}})
  assert.equal((await call('/hero',{auth:false})).data.items.length,1)
})
test('contact enquiries are validated, private, and support inbox status changes and deletion',async()=>{
  assert.equal((await call('/enquiries',{method:'POST',auth:false,body:{name:'x',phone:'abc'}})).response.status,400)
  assert.equal((await call('/enquiries',{method:'POST',auth:false,body:{name:'Test visitor',phone:'-------'}})).response.status,400)
  const submitted=await call('/enquiries',{method:'POST',auth:false,body:{name:'Test visitor',phone:'+91 9876543210',email:'visitor@example.com',message:'How can I join?'}})
  assert.equal(submitted.response.status,201)
  assert.equal((await call('/admin/enquiries',{auth:false})).response.status,401)
  const item=(await call('/admin/enquiries')).data.items[0]
  assert.equal(item.status,'new')
  assert.equal((await call(`/admin/enquiries/${item._id}`,{method:'PATCH',body:{status:'resolved'}})).data.item.status,'resolved')
  assert.equal((await call('/admin/overview')).data.enquiries.unread,0)
  assert.equal((await call(`/admin/enquiries/${item._id}`,{method:'DELETE'})).response.status,200)
})
test('overview counts and audit log match saved content; content persists in SQLite',async()=>{
  const overview=(await call('/admin/overview')).data
  assert.equal(overview.counts.news.total,1)
  assert.equal(overview.counts.announcements.total,4)
  assert.ok(overview.activity.some(item=>item.section==='news'&&item.action==='updated'))
  assert.equal(JSON.stringify(overview).includes(initialPassword),false)
  const second=openStore(join(directory,'admin.sqlite'))
  assert.equal(JSON.parse(second.db.prepare('SELECT payload FROM content WHERE id=?').get(newsId).payload).title,'Published news')
  second.db.close()
})
test('password changes require the old password and revoke previous sessions',async()=>{
  const oldCookie=cookie
  assert.equal((await call('/admin/password',{method:'POST',body:{currentPassword:'wrong',newPassword:'A-new-secure-password!'}})).response.status,400)
  assert.equal((await call('/admin/password',{method:'POST',body:{currentPassword:initialPassword,newPassword:'short'}})).response.status,400)
  const changed=await call('/admin/password',{method:'POST',body:{currentPassword:initialPassword,newPassword:'A-new-secure-password!'}})
  assert.equal(changed.response.status,200)
  assert.equal((await call('/admin/overview',{headers:{Cookie:oldCookie}})).response.status,401)
  cookie=changed.response.headers.get('set-cookie').split(';')[0]
  assert.equal((await call('/admin/session')).data.authenticated,true)
  assert.equal((await login(initialPassword)).response.status,401)
  assert.equal((await login('A-new-secure-password!')).response.status,200)
  assert.ok(await verifyPassword('A-new-secure-password!',db.prepare('SELECT password FROM admins').get().password))
})
test('logout and expiry deny further access',async()=>{
  assert.equal((await call('/admin/logout',{method:'POST'})).response.status,200)
  assert.equal((await call('/admin/overview')).response.status,401)
  await login('A-new-secure-password!')
  db.prepare('UPDATE sessions SET expires=0').run()
  assert.equal((await call('/admin/overview')).response.status,401)
})
test('login rate limiting caps repeated failures',async()=>{
  let status
  for(let i=0;i<12;i++)status=(await login('wrong')).response.status
  assert.equal(status,429)
})

test('production serves the built SPA and issues secure cookies with security headers',async()=>{
  const productionOrigin='https://bhide.example'
  const production=await createApp({dataDir:directory,origins:[productionOrigin],production:true,serveFrontend:true})
  const listener=production.app.listen(0,'127.0.0.1')
  await once(listener,'listening')
  const host=`http://127.0.0.1:${listener.address().port}`
  try{
    const page=await fetch(`${host}/admin/login`)
    assert.equal(page.status,200)
    assert.match(page.headers.get('content-type'),/text\/html/)
    assert.match(await page.text(),/id="root"/)
    assert.equal(page.headers.get('x-frame-options'),'DENY')
    assert.match(page.headers.get('strict-transport-security'),/max-age=/)
    const login=await fetch(`${host}/api/admin/login`,{method:'POST',headers:{Origin:productionOrigin,'Content-Type':'application/json'},body:JSON.stringify({username:'admin',password:'A-new-secure-password!'})})
    assert.equal(login.status,200)
    assert.match(login.headers.get('set-cookie'),/Secure/)
    const missing=await fetch(`${host}/api/unknown`)
    assert.equal(missing.status,404)
    assert.match(missing.headers.get('content-type'),/application\/json/)
  }finally{await new Promise(resolve=>listener.close(resolve));production.db.close()}
})
