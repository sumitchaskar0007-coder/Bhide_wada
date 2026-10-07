import PageLayout from './PageLayout'
import {Link} from '../components/RouterLink'

export default function NotFoundPage({language='mr'}){
  const english=language==='en'
  return <PageLayout
    title={english?'Page not found':'पृष्ठ सापडले नाही'}
    intro={english?'The page you requested does not exist.':'आपण शोधत असलेले पृष्ठ उपलब्ध नाही.'}
  >
    <Link className="primary" to="/">{english?'Return to home →':'मुख्यपृष्ठावर जा →'}</Link>
  </PageLayout>
}
