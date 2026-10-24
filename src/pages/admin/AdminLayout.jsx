import {useEffect,useState} from 'react'
import {Link,usePath} from '../../components/RouterLink'
import {getAdminSession,logoutAdmin} from '../../api/content'

const links=[
  ['/admin/dashboard','Overview','◫'],
  ['/admin/announcements','Notices & Announcements','◉'],
  ['/admin/news','News','▤'],
  ['/admin/events','Events','▦'],
  ['/admin/gallery','Gallery','▧'],
  ['/admin/hero','Hero slides','▣'],
  ['/admin/enquiries','Enquiries','✉'],
  ['/admin/account','Account settings','⚙']
]
export default function AdminLayout({children}){
  const path=usePath()
  const [error,setError]=useState('')
  const [user,setUser]=useState('Admin')
  const [busy,setBusy]=useState(false)
  useEffect(()=>{let active=true;getAdminSession().then(data=>{if(active&&data.user)setUser(data.user.username)}).catch(()=>{});return()=>{active=false}},[])
  const logout=async()=>{
    setBusy(true)
    try{
      await logoutAdmin()
      history.replaceState({},'','/admin/login')
      dispatchEvent(new Event('popstate'))
    }catch(requestError){setError(requestError.message);setBusy(false)}
  }
  return <div className="admin-workspace">
    <aside className="admin-sidebar">
      <Link className="admin-sidebar-brand" to="/admin/dashboard"><img src="/assets/images/logo.png" alt="Bhide Wada"/><span>Website administration<small>Content management</small></span></Link>
      <p className="admin-nav-label">WORKSPACE</p>
      <nav className="admin-sidebar-nav" aria-label="Admin pages">{links.map(([to,label,icon])=><Link key={to} className={path===to||(path==='/admin'&&to==='/admin/dashboard')?'active':''} aria-current={path===to?'page':undefined} to={to}><span aria-hidden="true">{icon}</span>{label}</Link>)}</nav>
      <div className="admin-sidebar-bottom"><Link to="/">View public website ↗</Link><p>Changes marked as published appear on your website.</p></div>
    </aside>
    <main className="admin-shell">
      <header className="admin-header"><div><p className="eyebrow">BHIDE WADA · ADMIN</p><h1>{links.find(([to])=>to===path)?.[1]||'Overview'}</h1></div><div className="admin-user-tools"><span className="admin-avatar" aria-hidden="true">{user.slice(0,1).toUpperCase()}</span><span>{user}</span><button className="outline" onClick={logout} disabled={busy}>{busy?'Signing out…':'Sign out'}</button></div></header>
      {error&&<p className="admin-error" role="alert">{error}</p>}
      <div className="admin-content">{children}</div>
    </main>
  </div>
}
