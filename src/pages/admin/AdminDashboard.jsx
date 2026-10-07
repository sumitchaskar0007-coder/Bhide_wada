import {useEffect,useState} from 'react'
import {Link} from '../../components/RouterLink'
import {adminRequest} from '../../api/content'

const sections=[
  {type:'news',path:'/admin/news',title:'News',description:'Publish and maintain committee news and updates.'},
  {type:'events',path:'/admin/events',title:'Events',description:'Manage event details, dates, and locations.'},
  {type:'gallery',path:'/admin/gallery',title:'Gallery',description:'Upload and manage gallery photos and videos.'},
  {type:'hero',path:'/admin/hero',title:'Home hero',description:'Manage the images displayed in the home page hero section.'}
]

export default function AdminDashboard(){
  const [state,setState]=useState({counts:{},error:''})
  useEffect(()=>{
    let active=true
    Promise.all(sections.map(section=>adminRequest(section.type)))
      .then(results=>{if(active)setState({counts:Object.fromEntries(sections.map((section,index)=>[section.type,results[index].items.length])),error:''})})
      .catch(error=>{if(active)setState({counts:{},error:error.message})})
    return ()=>{active=false}
  },[])

  return <section className="admin-dashboard">
    <p className="eyebrow">Content management</p>
    <h2>Dashboard</h2>
    <p className="admin-intro">Manage content on the public News, Events, Gallery, and Home hero sections.</p>
    {state.error&&<p className="admin-error" role="alert">{state.error}</p>}
    <div className="admin-section-cards">{sections.map(section=><article key={section.type}>
      <span className="admin-count">{state.counts[section.type]??'—'}</span>
      <h3>{section.title}</h3><p>{section.description}</p>
      <Link className="primary" to={section.path}>Manage {section.title} →</Link>
    </article>)}</div>
  </section>
}
