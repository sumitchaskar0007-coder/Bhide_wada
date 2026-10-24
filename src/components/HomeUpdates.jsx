import {useState} from 'react'
import {Link} from './RouterLink'
import usePublishedContent from '../hooks/usePublishedContent'

const tabs=[
  {id:'announcements',mr:'सूचना व घोषणा',en:'Notices',path:'/announcements'},
  {id:'news',mr:'बातम्या',en:'News',path:'/news'},
  {id:'events',mr:'कार्यक्रम',en:'Events',path:'/events'},
  {id:'documents',mr:'दस्तऐवज',en:'Documents',path:'/documents'}
]
const links={
  announcements:[['/announcements','सर्व सूचना व घोषणा','All notices and announcements']],
  news:[['/news','समितीकडून बातम्या व अपडेट्स','News and updates from the committee'],['/projects','स्मारक प्रकल्प व उपक्रम','Memorial projects and activities']],
  events:[['/events','सार्वजनिक कार्यक्रम आणि समुदाय मेळावे','Public programmes and community gatherings'],['/membership','सदस्यत्वाविषयी माहिती','Membership information']],
  documents:[['/documents','समितीची कागदपत्रे आणि माहिती','Committee documents and information'],['/contact','कागदपत्रांसाठी संपर्क साधा','Contact us about documents']]
}
export default function HomeUpdates({language='mr'}){
  const en=language==='en'
  const [selected,setSelected]=useState('announcements')
  const announcements=usePublishedContent('announcements')
  const news=usePublishedContent('news')
  const events=usePublishedContent('events')
  const content={announcements,news,events}
  const tab=tabs.find(item=>item.id===selected)
  const items=content[selected]?.items||[]
  const loading=content[selected]?.loading
  const error=content[selected]?.error
  const selectWithKeyboard=event=>{
    const index=tabs.findIndex(item=>item.id===selected)
    const next=event.key==='ArrowRight'?(index+1)%tabs.length:event.key==='ArrowLeft'?(index+tabs.length-1)%tabs.length:event.key==='Home'?0:event.key==='End'?tabs.length-1:null
    if(next===null)return
    event.preventDefault()
    setSelected(tabs[next].id)
    document.getElementById(`home-tab-${tabs[next].id}`)?.focus()
  }
  return <aside className="portal-notices">
    <div className="portal-tabs" role="tablist" aria-label={en?'Notices, news, events and documents':'सूचना, बातम्या, कार्यक्रम आणि दस्तऐवज'} onKeyDown={selectWithKeyboard}>
      {tabs.map(item=><button key={item.id} id={`home-tab-${item.id}`} role="tab" aria-selected={selected===item.id} aria-controls="home-notice-panel" tabIndex={selected===item.id?0:-1} onClick={()=>setSelected(item.id)}>{en?item.en:item.mr}</button>)}
    </div>
    <div className="portal-notice-body" id="home-notice-panel" role="tabpanel" aria-labelledby={`home-tab-${selected}`} tabIndex={0}>
      <h2>{en?tab.en:tab.mr}</h2>
      {loading&&selected!=='documents'&&<p className="portal-loading" role="status">{en?'Loading updates…':'माहिती लोड होत आहे…'}</p>}
      {error&&<p className="content-error" role="status">{en?'Updates are temporarily unavailable. Please try again later.':'माहिती सध्या उपलब्ध नाही. कृपया काही वेळाने पुन्हा प्रयत्न करा.'}</p>}
      <ul>
        {items.slice(0,5).map(item=><li key={item._id}><Link to={tab.path}><span className="portal-list-arrow" aria-hidden="true">›</span>{item.title}</Link></li>)}
        {links[selected].map(([path,mr,label])=><li key={path}><Link to={path}><span className="portal-list-arrow" aria-hidden="true">›</span>{en?label:mr}</Link></li>)}
      </ul>
      <Link className="portal-view-all" to={tab.path}>{en?'View all':'सर्व पहा'} <span aria-hidden="true">→</span></Link>
    </div>
  </aside>
}
