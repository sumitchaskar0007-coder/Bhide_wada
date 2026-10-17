import {join} from 'node:path'
import {openStore} from './store.js'

export async function createRepository({dataDir,mongoUri,dbName='bhide_wada'}){
  if(mongoUri){
    const {openMongoRepository}=await import('./mongo-store.js')
    return openMongoRepository(mongoUri,dbName)
  }
  const {db,transaction,audit}=openStore(join(dataDir,'admin.sqlite'))
  const parse=row=>row?JSON.parse(row.payload):null
  return {
    kind:'sqlite',db,
    hasAdmin:()=>Boolean(db.prepare('SELECT id FROM admins LIMIT 1').get()),
    findAdmin:({id,username})=>id?db.prepare('SELECT * FROM admins WHERE id=?').get(id):db.prepare('SELECT * FROM admins WHERE username=?').get(username),
    createAdmin:admin=>db.prepare('INSERT INTO admins VALUES(?,?,?)').run(admin.id,admin.username,admin.password),
    findSession:(token,time)=>db.prepare('SELECT admins.id, admins.username FROM sessions JOIN admins ON admins.id=sessions.admin_id WHERE token=? AND expires>?').get(token,time),
    createSession:(token,id,expires)=>transaction(()=>{db.prepare('DELETE FROM sessions WHERE expires<=?').run(Date.now());db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(token,id,expires)}),
    deleteSession:token=>db.prepare('DELETE FROM sessions WHERE token=?').run(token),
    changePassword:(admin,password)=>transaction(()=>{db.prepare('UPDATE admins SET password=? WHERE id=?').run(password,admin.id);db.prepare('DELETE FROM sessions WHERE admin_id=?').run(admin.id);audit(admin.username,'changed password','account','Password changed; previous sessions revoked')}),
    recordActivity:audit,
    listContent:type=>db.prepare('SELECT payload FROM content WHERE type=? ORDER BY rowid DESC').all(type).map(parse),
    getContent:(id,type)=>parse(db.prepare('SELECT payload FROM content WHERE id=? AND type=?').get(id,type)),
    saveContent:(type,item,actor,action)=>transaction(()=>{db.prepare('INSERT INTO content VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload').run(item._id,type,JSON.stringify(item));audit(actor,action,type,item.title)}),
    deleteContent:(type,item,actor)=>transaction(()=>{db.prepare('DELETE FROM content WHERE id=? AND type=?').run(item._id,type);audit(actor,'deleted',type,item.title)}),
    listEnquiries:()=>db.prepare('SELECT payload FROM enquiries ORDER BY rowid DESC').all().map(parse),
    getEnquiry:id=>parse(db.prepare('SELECT payload FROM enquiries WHERE id=?').get(id)),
    insertEnquiry:item=>db.prepare('INSERT INTO enquiries VALUES(?,?)').run(item._id,JSON.stringify(item)),
    updateEnquiry:(item,actor)=>transaction(()=>{db.prepare('UPDATE enquiries SET payload=? WHERE id=?').run(JSON.stringify(item),item._id);audit(actor,'updated','enquiries',item.name)}),
    deleteEnquiry:(item,actor)=>transaction(()=>{db.prepare('DELETE FROM enquiries WHERE id=?').run(item._id);audit(actor,'deleted','enquiries',item.name)}),
    recentActivity:()=>db.prepare('SELECT id,actor,action,section,title,created_at AS createdAt FROM activity ORDER BY rowid DESC LIMIT 20').all(),
    close:()=>db.close()
  }
}
