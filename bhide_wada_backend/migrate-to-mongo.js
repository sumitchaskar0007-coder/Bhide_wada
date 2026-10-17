import 'dotenv/config'
import {resolve,join} from 'node:path'
import {existsSync} from 'node:fs'
import {openStore} from './store.js'
import {openMongoRepository,describeDatabaseError} from './mongo-store.js'

const path=join(resolve(process.env.DATA_DIR||'.data'),'admin.sqlite')
let local,remote
try{
  if(!process.env.MONGODB_URI)throw new Error('Set MONGODB_URI in the ignored root .env before migrating.')
  if(!existsSync(path))throw new Error('No SQLite database exists to migrate. Use npm run admin:setup to create a new administrator in MongoDB.')
  local=openStore(path)
  remote=await openMongoRepository(process.env.MONGODB_URI,process.env.MONGODB_DB_NAME||'bhide_wada')
  const admins=local.db.prepare('SELECT * FROM admins').all().map(({id,...admin})=>({_id:id,...admin}))
  const content=local.db.prepare('SELECT * FROM content ORDER BY rowid').all().map(row=>({...JSON.parse(row.payload),type:row.type}))
  const enquiries=local.db.prepare('SELECT payload FROM enquiries ORDER BY rowid').all().map(row=>JSON.parse(row.payload))
  const activity=local.db.prepare('SELECT * FROM activity ORDER BY rowid').all().map(({id,created_at,...item})=>({_id:id,...item,createdAt:created_at}))
  const collections=[['bw_admins',admins],['bw_content',content],['bw_enquiries',enquiries],['bw_activity',activity]]
  const counts={}
  // Atomic insert-only migration. Re-running never replaces existing remote records.
  const session=await remote.connection.startSession()
  try{
    await session.withTransaction(async()=>{
      for(const [name,items] of collections){
        counts[name]=0
        for(const item of items){
          const {_id,...fields}=item
          const result=await remote.db.collection(name).updateOne({_id},{$setOnInsert:fields},{upsert:true,session})
          counts[name]+=result.upsertedCount
        }
      }
    })
  }finally{await session.endSession()}
  console.log(`Migration complete: ${JSON.stringify(counts)}. Local data is retained. Sign in again using your existing admin credentials.`)
}catch(error){console.error(error.code===11000?'Migration stopped: a MongoDB username conflicts with your local administrator. Existing data was not overwritten.':error.message?.startsWith('MongoDB')||!remote?error.message:describeDatabaseError(error));process.exitCode=1}
finally{local?.db.close();await remote?.close()}
