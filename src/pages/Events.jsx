import {useEffect,useState} from 'react'
import PageLayout from './PageLayout'
import {getContent} from '../api/content'

const copy={
  en:{title:'Events',intro:'Confirmed public programmes and community gatherings.',label:'Community calendar',heading:'Upcoming programmes',empty:'No event dates have been announced.',loading:'Loading events…',error:'Unable to load events.',location:'Location'},
  mr:{title:'कार्यक्रम',intro:'निश्चित झालेल्या सार्वजनिक कार्यक्रम आणि समुदाय मेळाव्यांची माहिती.',label:'समुदाय दिनदर्शिका',heading:'आगामी कार्यक्रम',empty:'कार्यक्रमांच्या तारखा अद्याप जाहीर झालेल्या नाहीत.',loading:'कार्यक्रम लोड होत आहेत…',error:'कार्यक्रम लोड करता आले नाहीत.',location:'स्थळ'}
}

export default function EventsPage({language='mr'}){
  const t=copy[language]||copy.mr
  const [state,setState]=useState({items:[],loading:true,error:''})

  useEffect(()=>{
    let active=true
    getContent('events')
      .then(({items})=>{if(active)setState({items,loading:false,error:''})})
      .catch(error=>{if(active)setState({items:[],loading:false,error:error.message||t.error})})
    return ()=>{active=false}
  },[t.error])

  return <PageLayout title={t.title} intro={t.intro}>
    <section className="community-events">
      <div className="community-page-heading"><p className="eyebrow">{t.label}</p><h2>{t.heading}</h2></div>
      {state.loading&&<p role="status">{t.loading}</p>}
      {state.error&&<p className="content-error" role="alert">{state.error}</p>}
      {!state.loading&&!state.error&&state.items.length===0&&<div className="events-empty-state"><div className="calendar-mark" aria-hidden="true"><span>—</span><b>··</b></div><h3>{t.empty}</h3></div>}
      <div className="published-content-list">{state.items.map(item=><article className="published-content-card" key={item._id}>
        {item.mediaUrl&&(item.mediaResourceType==='video'
          ?<video src={item.mediaUrl} controls preload="metadata" aria-label={item.title}/>
          :<img src={item.mediaUrl} alt="" loading="lazy"/>)}
        <div><p className="eyebrow">{new Date(item.date).toLocaleString(language==='en'?'en':'mr',{dateStyle:'long',timeStyle:'short'})}</p><h3>{item.title}</h3><p className="published-summary">{item.summary}</p><p>{item.content}</p><p><b>{t.location}:</b> {item.location}</p></div>
      </article>)}</div>
    </section>
  </PageLayout>
}
