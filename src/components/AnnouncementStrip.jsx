import {useEffect,useState} from 'react'
import {Link} from './RouterLink'
import {getContent} from '../api/content'
export default function AnnouncementStrip({language='mr'}){
  const [items,setItems]=useState([])
  const en=language==='en'
  useEffect(()=>{let active=true;getContent('announcements').then(data=>{if(active)setItems(data.items)}).catch(()=>{});return()=>{active=false}},[])
  return <div className="portal-update-strip"><div className="shell portal-update-inner"><strong>{en?'Latest updates':'नवीनतम अद्यतने'}</strong><div>{items.length?items.slice(0,5).map(item=><Link key={item._id} to="/announcements">{item.pinned?'● ':''}{item.title}</Link>):<><Link to="/announcements">{en?'Announcements':'घोषणा व सूचना'}</Link><span aria-hidden="true">•</span><Link to="/news">{en?'News & updates':'बातम्या व अपडेट्स'}</Link><span aria-hidden="true">•</span><Link to="/events">{en?'Upcoming programmes':'आगामी कार्यक्रम'}</Link><span aria-hidden="true">•</span><Link to="/projects">{en?'Memorial projects':'स्मारक प्रकल्प'}</Link></>}</div><Link className="portal-updates-all" to="/announcements" aria-label={en?'View all announcements':'सर्व घोषणा पहा'}>→</Link></div></div>
}
