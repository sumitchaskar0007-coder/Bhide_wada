import {useEffect,useState} from 'react'
import {Link} from '../../components/RouterLink'
import {adminRequest} from '../../api/content'
const sections=[
  {type:'announcements',title:'Notices & Announcements',description:'Share important notices. Pin updates or set an expiry.'},
  {type:'news',title:'News',description:'Publish committee news, stories and project updates.'},
  {type:'events',title:'Events',description:'Manage programme dates, venues and details.'},
  {type:'gallery',title:'Gallery',description:'Upload photos and videos or add YouTube links.'},
  {type:'hero',title:'Hero slides',description:'Add banner images to your homepage slideshow.'}
]
export default function AdminDashboard(){
  const [state,setState]=useState({data:null,error:'',loading:true})
  const load=()=>{setState(current=>({...current,loading:true,error:''}));adminRequest('overview').then(data=>setState({data,error:'',loading:false})).catch(error=>setState({data:null,error:error.message,loading:false}))}
  useEffect(()=>{let active=true;adminRequest('overview').then(data=>{if(active)setState({data,error:'',loading:false})}).catch(error=>{if(active)setState({data:null,error:error.message,loading:false})});return()=>{active=false}},[])
  const data=state.data
  const total=data?Object.values(data.counts).reduce((sum,item)=>sum+item.total,0):'—'
  const published=data?Object.values(data.counts).reduce((sum,item)=>sum+item.published,0):'—'
  return <section className="admin-dashboard">
    <div className="admin-manager-heading"><div><p className="eyebrow">YOUR WEBSITE AT A GLANCE</p><h2>Welcome back{data?`, ${data.user.username}`:''}.</h2><p className="admin-intro">Keep your community informed. Create, review and publish from one place.</p></div><button className="outline" onClick={load} disabled={state.loading}>Refresh</button></div>
    {state.error&&<p className="admin-error" role="alert">{state.error}</p>}
    {state.loading&&<p role="status">Loading dashboard…</p>}
    <div className="admin-metrics"><article><span>Total content</span><b>{total}</b><small>Across five content sections</small></article><article><span>Visible on website</span><b>{published}</b><small>Published, active and not expired</small></article><article><span>Drafts / hidden</span><b>{data?total-published:'—'}</b><small>Visible only to administrators</small></article><Link to="/admin/enquiries"><span>New enquiries</span><b>{data?.enquiries.unread??'—'}</b><small>Open your community inbox →</small></Link></div>
    <h3 className="admin-section-title">Manage your content</h3>
    <div className="admin-section-cards">{sections.map(section=><article key={section.type}><div className="admin-card-top"><span className="admin-card-label">{section.title}</span><span className="admin-count">{data?.counts[section.type]?.total??'—'}</span></div><p>{section.description}</p><small>{data?`${data.counts[section.type].published} visible on website`:'Loading counts…'}</small><Link className="admin-manage-link" to={`/admin/${section.type}`}>Manage {section.title.toLowerCase()} →</Link><Link className="admin-manage-link" to={section.type==='hero'?'/':`/${section.type}`} target="_blank" rel="noreferrer">View public page ↗</Link></article>)}</div>
    <section className="admin-activity"><div className="admin-manager-heading"><h3>Recent activity</h3><span>Latest 20 actions</span></div>{!state.loading&&!data?.activity.length&&<p>No activity yet. Create your first announcement to get started.</p>}<ul>{data?.activity.map(item=><li key={item.id}><span className="admin-activity-dot" aria-hidden="true"/><div><b>{item.title}</b><span>{item.actor} · {item.action} · {item.section}</span></div><time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time></li>)}</ul></section>
  </section>
}
