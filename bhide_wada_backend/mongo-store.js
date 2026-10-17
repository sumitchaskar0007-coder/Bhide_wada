import mongoose from 'mongoose'
import {randomUUID} from 'node:crypto'

export function describeDatabaseError(error){
  if(error.code===18||error.codeName==='AuthenticationFailed')return 'MongoDB authentication failed. Check the database username and password in .env.'
  if(['ENOTFOUND','ECONNREFUSED','ETIMEOUT','ESERVFAIL'].includes(error.code))return 'MongoDB hostname could not be reached. Check DNS and network access.'
  if(error.name==='MongoServerSelectionError'||error.name==='MongooseServerSelectionError')return 'Cannot reach MongoDB Atlas. Check the Atlas Network Access IP allowlist and cluster availability.'
  return `MongoDB connection failed (${error.codeName||error.name||'database error'}). Check .env and Atlas access permissions.`
}
export async function openMongoRepository(uri,dbName='bhide_wada'){
  const connection=mongoose.createConnection()
  // Do not log driver errors: they can contain the connection string.
  connection.on('error',()=>{})
  try{
    await connection.openUri(uri,{dbName,serverSelectionTimeoutMS:15000,connectTimeoutMS:10000,maxPoolSize:10,autoIndex:false})
    const database=connection.db
    const admins=database.collection('bw_admins')
    const sessions=database.collection('bw_sessions')
    const content=database.collection('bw_content')
    const enquiries=database.collection('bw_enquiries')
    const activity=database.collection('bw_activity')
    await Promise.all([
      admins.createIndex({username:1},{unique:true}),
      sessions.createIndex({expiresAt:1},{expireAfterSeconds:0}),
      sessions.createIndex({adminId:1}),
      content.createIndex({type:1,createdAt:-1,_id:-1}),
      enquiries.createIndex({createdAt:-1}),
      activity.createIndex({createdAt:-1})
    ])
    const cleanAdmin=doc=>doc?{id:doc._id,username:doc.username,password:doc.password}:null
    const auditDocument=(actor,action,section,title)=>({_id:randomUUID(),actor,action,section,title,createdAt:new Date().toISOString()})
    const withTransaction=async fn=>{
      const session=await connection.startSession()
      try{return await session.withTransaction(()=>fn(session))}finally{await session.endSession()}
    }
    return {
      kind:'mongodb',connection,db:database,
      hasAdmin:async()=>Boolean(await admins.findOne({},{projection:{_id:1}})),
      findAdmin:async({id,username})=>cleanAdmin(await admins.findOne(id?{_id:id}:{username})),
      createAdmin:admin=>admins.insertOne({_id:admin.id,username:admin.username,password:admin.password}),
      findSession:async(token,time)=>{
        const session=await sessions.findOne({_id:token,expiresAt:{$gt:new Date(time)}})
        if(!session)return null
        const admin=await admins.findOne({_id:session.adminId},{projection:{username:1}})
        return admin?{id:admin._id,username:admin.username}:null
      },
      createSession:(token,id,expires)=>sessions.insertOne({_id:token,adminId:id,expiresAt:new Date(expires)}),
      deleteSession:token=>sessions.deleteOne({_id:token}),
      changePassword:(admin,password)=>withTransaction(async session=>{
        await admins.updateOne({_id:admin.id},{$set:{password}},{session})
        await sessions.deleteMany({adminId:admin.id},{session})
        await activity.insertOne(auditDocument(admin.username,'changed password','account','Password changed; previous sessions revoked'),{session})
      }),
      recordActivity:(...args)=>activity.insertOne(auditDocument(...args)),
      listContent:async type=>(await content.find({type}).sort({createdAt:-1,_id:-1}).toArray()).map(({type,...item})=>item),
      getContent:async(id,type)=>{const item=await content.findOne({_id:id,type});if(!item)return null;const {type:_,...payload}=item;return payload},
      saveContent:(type,item,actor,action)=>withTransaction(async session=>{
        await content.replaceOne({_id:item._id,type},{...item,type},{upsert:true,session})
        await activity.insertOne(auditDocument(actor,action,type,item.title),{session})
      }),
      deleteContent:(type,item,actor)=>withTransaction(async session=>{
        await content.deleteOne({_id:item._id,type},{session})
        await activity.insertOne(auditDocument(actor,'deleted',type,item.title),{session})
      }),
      listEnquiries:()=>enquiries.find({}).sort({createdAt:-1,_id:-1}).toArray(),
      getEnquiry:id=>enquiries.findOne({_id:id}),
      insertEnquiry:item=>enquiries.insertOne(item),
      updateEnquiry:(item,actor)=>withTransaction(async session=>{
        await enquiries.replaceOne({_id:item._id},item,{session})
        await activity.insertOne(auditDocument(actor,'updated','enquiries',item.name),{session})
      }),
      deleteEnquiry:(item,actor)=>withTransaction(async session=>{
        await enquiries.deleteOne({_id:item._id},{session})
        await activity.insertOne(auditDocument(actor,'deleted','enquiries',item.name),{session})
      }),
      recentActivity:async()=>(await activity.find({}).sort({createdAt:-1,_id:-1}).limit(20).toArray()).map(({_id,...item})=>({id:_id,...item})),
      close:()=>connection.close()
    }
  }catch(error){await connection.close().catch(()=>{});throw new Error(describeDatabaseError(error))}
}
