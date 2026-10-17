import 'dotenv/config'
import {spawn} from 'node:child_process'
if(!process.env.MONGODB_URI){console.error('Set MONGODB_URI in .env before running the Atlas integration tests.');process.exit(1)}
// The test suite creates and drops its own random database. It never uses bhide_wada.
const child=spawn(process.execPath,['--test','tests/backend.test.js'],{stdio:'inherit',env:{...process.env,TEST_MONGODB_URI:process.env.MONGODB_URI}})
child.on('exit',code=>{process.exitCode=code??1})
child.on('error',()=>{console.error('Could not start MongoDB integration tests.');process.exitCode=1})
