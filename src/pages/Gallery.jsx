import PageLayout from './PageLayout'
import usePublishedContent from '../hooks/usePublishedContent'
import PublishedMedia from '../components/PublishedMedia'

const copy={
  en:{title:'Gallery',intro:'Photographs and videos from Bhide Wada and community activities.',label:'Photo & video gallery',empty:'No photos or videos have been published yet.',loading:'Loading gallery…',error:'Unable to load the gallery.'},
  mr:{title:'गॅलरी',intro:'भिडे वाडा आणि समुदाय उपक्रमांची छायाचित्रे व व्हिडिओ.',label:'छायाचित्र व व्हिडिओ संग्रह',empty:'छायाचित्रे किंवा व्हिडिओ अद्याप प्रसिद्ध केलेले नाहीत.',loading:'गॅलरी लोड होत आहे…',error:'गॅलरी लोड करता आली नाही.'}
}

export default function GalleryPage({language='mr'}){
  const t=copy[language]||copy.mr
  const state=usePublishedContent('gallery')

  return <PageLayout title={t.title} intro={t.intro}>
    <section className="community-gallery">
      <div className="community-page-heading"><p className="eyebrow">{t.label}</p><span aria-hidden="true">✦</span></div>
      {state.loading&&<p role="status">{t.loading}</p>}
      {state.error&&<p className="content-error" role="alert">{state.error}</p>}
      {!state.loading&&!state.error&&state.items.length===0&&<p className="gallery-empty-state">{t.empty}</p>}
      <div className="managed-gallery-grid">{state.items.map(item=><figure key={item._id}>
        <div className="gallery-media-frame">
          <PublishedMedia item={item}/>
        </div>
        <figcaption><h3>{item.title}</h3>{item.description&&<p>{item.description}</p>}
          <p className="content-provenance">{item.capturedAt
            ?<>{language==='en'?'Taken on: ':'छायाचित्र / व्हिडिओ दिनांक: '}<time dateTime={item.capturedAt}>{new Date(`${item.capturedAt}T00:00:00Z`).toLocaleDateString(language==='en'?'en-IN':'mr-IN',{dateStyle:'medium',timeZone:'UTC'})}</time></>
            :<>{language==='en'?'Date taken not provided':'छायाचित्र / व्हिडिओ घेतल्याचा दिनांक उपलब्ध नाही'}</>}
          </p>
          {item.sourceUrl&&<a className="content-source" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{language==='en'?'Source / credit ↗':'स्रोत / छायाचित्र श्रेय ↗'}</a>}
        </figcaption>
      </figure>)}</div>
    </section>
  </PageLayout>
}
