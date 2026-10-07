import {useEffect,useState} from 'react'
import PageLayout from './PageLayout'
import {getContent} from '../api/content'

const copy={
  en:{title:'News & Updates',intro:'Committee-approved notices and verified updates about Bhide Wada.',label:'Official updates',heading:'Updates from the committee',empty:'There are no approved updates to publish yet.',loading:'Loading updates…',error:'Unable to load news.',more:'Read more',less:'Show less'},
  mr:{title:'बातम्या व अपडेट्स',intro:'भिडे वाड्याबद्दल समितीने मंजूर केलेल्या सूचना आणि पडताळलेली माहिती.',label:'अधिकृत अपडेट्स',heading:'समितीकडून माहिती',empty:'प्रसिद्ध करण्यासाठी मंजूर अपडेट्स सध्या उपलब्ध नाहीत.',loading:'अपडेट्स लोड होत आहेत…',error:'बातम्या लोड करता आल्या नाहीत.',more:'अधिक वाचा',less:'कमी दाखवा'}
}

function NewsCard({item,language,moreLabel,lessLabel}){
  const [expanded,setExpanded]=useState(false)
  const detailsId=`news-details-${item._id}`
  const className=[
    'published-content-card',
    'news-card',
    item.mediaUrl?'has-media':'',
    expanded?'expanded':''
  ].filter(Boolean).join(' ')

  return <article className={className}>
    {item.mediaUrl&&(item.mediaResourceType==='video'
      ?<video src={item.mediaUrl} controls preload="metadata" aria-label={item.title}/>
      :<img src={item.mediaUrl} alt="" loading="lazy"/>)}
    <div className="news-card-copy">
      <p className="eyebrow">{new Date(item.createdAt).toLocaleDateString(language==='en'?'en':'mr')}</p>
      <h3>{item.title}</h3>
      {item.summary&&<p className="published-summary">{item.summary}</p>}
      <div className="news-card-details" id={detailsId} hidden={!expanded}>
        <p>{item.content}</p>
      </div>
      <button className="news-card-toggle" type="button" aria-expanded={expanded} aria-controls={detailsId} onClick={()=>setExpanded(value=>!value)}>
        {expanded?lessLabel:moreLabel}
      </button>
    </div>
  </article>
}

export default function NewsPage({language='mr'}){
  const t=copy[language]||copy.mr
  const [state,setState]=useState({items:[],loading:true,error:''})

  useEffect(()=>{
    let active=true
    getContent('news')
      .then(({items})=>{if(active)setState({items,loading:false,error:''})})
      .catch(error=>{if(active)setState({items:[],loading:false,error:error.message||t.error})})
    return ()=>{active=false}
  },[t.error])

  return <PageLayout title={t.title} intro={t.intro}>
    <section className="community-news">
      <div className="community-page-heading"><p className="eyebrow">{t.label}</p><h2>{t.heading}</h2></div>
      {state.loading&&<p role="status">{t.loading}</p>}
      {state.error&&<p className="content-error" role="alert">{state.error}</p>}
      {!state.loading&&!state.error&&state.items.length===0&&<div className="news-empty-state"><span aria-hidden="true">✦</span><div><h3>{t.empty}</h3></div></div>}
      <div className="published-content-list news-card-list">
        {state.items.map(item=><NewsCard key={item._id} item={item} language={language} moreLabel={t.more} lessLabel={t.less}/>)}
      </div>
    </section>
  </PageLayout>
}
