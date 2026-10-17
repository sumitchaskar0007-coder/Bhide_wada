import 'dotenv/config'
import {resolve} from 'node:path'
import {createApp} from './app.js'

const production=process.env.NODE_ENV==='production'
const origins=process.env.CLIENT_ORIGIN?.split(',').map(value=>value.trim()).filter(Boolean)
if(production&&!origins?.length)throw new Error('Set CLIENT_ORIGIN to your website HTTPS origin before running in production.')
if(production&&origins.some(value=>!value.startsWith('https://')))throw new Error('Production CLIENT_ORIGIN must use HTTPS.')
const {app,db}=await createApp({dataDir:resolve(process.env.DATA_DIR||'.data'),origins,production,serveFrontend:production,maxUploadMB:Number(process.env.MAX_UPLOAD_MB)||50})
const port=Number(process.env.PORT)||5038
const host=process.env.HOST||'127.0.0.1'
const server=app.listen(port,host,()=>{
  console.log(`Bhide Wada API: http://${host}:${port}`)
  if(!db.prepare('SELECT id FROM admins LIMIT 1').get())console.log('No admin account. Run npm run admin:setup in another terminal.')
})
server.on('error',error=>{console.error(error.message);process.exitCode=1;db.close()})
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>{db.close();process.exit(0)}))
export {app}
