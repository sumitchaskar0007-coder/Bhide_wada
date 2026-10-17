import 'dotenv/config'
import {resolve} from 'node:path'
import {createApp} from './app.js'

let app
try{
  const production=process.env.NODE_ENV==='production'
  const origins=process.env.CLIENT_ORIGIN?.split(',').map(value=>value.trim()).filter(Boolean)
  if(production&&!origins?.length)throw new Error('Set CLIENT_ORIGIN to your website HTTPS origin before running in production.')
  if(production&&origins.some(value=>!value.startsWith('https://')))throw new Error('Production CLIENT_ORIGIN must use HTTPS.')
  const result=await createApp({dataDir:resolve(process.env.DATA_DIR||'.data'),origins,production,serveFrontend:production,maxUploadMB:Number(process.env.MAX_UPLOAD_MB)||50,mongoUri:process.env.MONGODB_URI,dbName:process.env.MONGODB_DB_NAME||'bhide_wada'})
  app=result.app
  const {store}=result
  const hasAdmin=await store.hasAdmin()
  const port=Number(process.env.PORT)||5038
  const host=process.env.HOST||'127.0.0.1'
  const server=app.listen(port,host,()=>{
    console.log(`Bhide Wada API: http://${host}:${port} (${store.kind})`)
    if(!hasAdmin)console.log('No admin account. Run npm run admin:setup in another terminal.')
  })
  server.on('error',async error=>{console.error(error.code||'Server failed to listen');process.exitCode=1;await store.close()})
  for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(async()=>{await store.close();process.exit(0)}))
}catch(error){console.error(error.message);process.exitCode=1}
export {app}
