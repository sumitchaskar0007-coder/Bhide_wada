import {useEffect,useState} from 'react'
import PageLayout from './PageLayout'
import {Link} from '../components/RouterLink'
import {getContent} from '../api/content'
export default function AnnouncementsPage({language='mr'}){
  const en=language==='en'
  const [state,setState]=useState({items:[],loading:true,error:''})
  useEffect(()=>{let active=true;getContent('announcements').then(({items})=>{if(active)setState({items,loading:false,error:''})}).catch(error=>{if(active)setState({items:[],loading:false,error:error.message})});return()=>{active=false}},[])
  return <PageLayout title={en?'Announcements':'घोषणा व सूचना'} intro={en?'Important notices and announcements from the committee.':'समितीकडून महत्त्वाच्या घोषणा आणि सूचना.'}><section className="community-news">{state.loading&&<p role="status">{en?'Loading announcements…':'सूचना लोड होत आहेत…'}</p>}{state.error&&<p className="content-error" role="alert">{state.error}</p>}{!state.loading&&!state.error&&!state.items.length&&<p>{en?'No announcements have been published yet.':'सध्या कोणत्याही घोषणा प्रसिद्ध केलेल्या नाहीत.'}</p>}<div className="published-content-list">{state.items.map(item=><article className="published-content-card announcement-card" key={item._id}><div><p className="eyebrow">{item.pinned?(en?'Pinned notice · ':'महत्त्वाची सूचना · '):''}{new Date(item.createdAt).toLocaleDateString(en?'en-IN':'mr-IN')}</p><h2>{item.title}</h2>{item.summary&&<p className="published-summary">{item.summary}</p>}<p className="announcement-content">{item.content}</p>{item.link&&(item.link.startsWith('/')?<Link className="outline" to={item.link}>{en?'View details →':'अधिक माहिती →'}</Link>:<a className="outline" href={item.link} target="_blank" rel="noreferrer">{en?'View details ↗':'अधिक माहिती ↗'}</a>)}</div></article>)}</div></section></PageLayout>
}
