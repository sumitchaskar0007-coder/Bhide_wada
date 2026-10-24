import PageLayout from './PageLayout'
import {Link} from '../components/RouterLink'
import PublishedMedia from '../components/PublishedMedia'
import usePublishedContent from '../hooks/usePublishedContent'

export default function AnnouncementsPage({language='mr'}){
  const en=language==='en'
  const state=usePublishedContent('announcements')
  return <PageLayout title={en?'Notices & Announcements':'सूचना व घोषणा'} intro={en?'All current published notices and announcements from the committee.':'समितीच्या सर्व प्रकाशित व सध्या लागू असलेल्या सूचना आणि घोषणा.'}>
    <section className="community-news">
      {state.loading&&<p role="status">{en?'Loading announcements…':'सूचना लोड होत आहेत…'}</p>}
      {state.error&&<p className="content-error" role="alert">{state.error}</p>}
      {!state.loading&&!state.error&&!state.items.length&&<p>{en?'No announcements have been published yet.':'सध्या कोणत्याही घोषणा प्रसिद्ध केलेल्या नाहीत.'}</p>}
      <div className="published-content-list">
        {state.items.map(item=><article className="published-content-card announcement-card" key={item._id}>
          {item.mediaUrl&&<div className="announcement-media"><PublishedMedia item={item}/></div>}
          <div>
            <p className="eyebrow">{item.pinned?(en?'Pinned notice · ':'महत्त्वाची सूचना · '):''}<time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleDateString(en?'en-IN':'mr-IN')}</time></p>
            <h2>{item.title}</h2>
            {item.summary&&<p className="published-summary">{item.summary}</p>}
            <p className="announcement-content">{item.content}</p>
            {item.link&&(item.link.startsWith('/')
              ?<Link className="outline" to={item.link}>{en?'View details →':'अधिक माहिती →'}</Link>
              :<a className="outline" href={item.link} target="_blank" rel="noreferrer">{en?'View details ↗':'अधिक माहिती ↗'}</a>)}
          </div>
        </article>)}
      </div>
    </section>
  </PageLayout>
}
