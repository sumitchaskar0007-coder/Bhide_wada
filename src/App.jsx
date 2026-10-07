import {useState} from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import {usePath} from './components/RouterLink'
import HomePage from './pages/HomePage'
import {ContactPage,ContentPage} from './pages/ContentPages'
import {DocumentsPage,MembershipPage} from './pages/CommunityPages'
import NewsPage from './pages/News'
import EventsPage from './pages/Events'
import GalleryPage from './pages/Gallery'
import BonafidePage from './pages/BonafidePage'
import NotFoundPage from './pages/NotFoundPage'
import AdminGuard from './pages/admin/AdminGuard'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import NewsAdmin from './pages/admin/NewsAdmin'
import EventAdmin from './pages/admin/EventAdmin'
import GalleryAdmin from './pages/admin/GalleryAdmin'
import HeroAdmin from './pages/admin/HeroAdmin'

const pageRoutes={
  '/':language=><HomePage language={language}/>,
  '/about':language=><ContentPage type="about" language={language}/>,
  '/committee':language=><ContentPage type="committee" language={language}/>,
  '/projects':language=><ContentPage type="projects" language={language}/>,
  '/news':language=><NewsPage language={language}/>,
  '/events':language=><EventsPage language={language}/>,
  '/gallery':language=><GalleryPage language={language}/>,
  '/membership':language=><MembershipPage language={language}/>,
  '/documents':language=><DocumentsPage language={language}/>,
  '/contact':language=><ContactPage language={language}/>
}

const adminRoutes={
  '/admin/dashboard':<AdminDashboard/>,
  '/admin/news':<NewsAdmin/>,
  '/admin/events':<EventAdmin/>,
  '/admin/gallery':<GalleryAdmin/>,
  '/admin/hero':<HeroAdmin/>
}

export default function App(){
  const [language,setLanguage]=useState(()=>localStorage.getItem('language')||'mr')
  const path=usePath().replace(/\/+$/,'')||'/'

  if(path==='/principal/bonafide') return <BonafidePage/>
  if(path==='/admin/login') return <AdminLogin/>
  if(adminRoutes[path]) return <AdminGuard><AdminLayout>{adminRoutes[path]}</AdminLayout></AdminGuard>
  if(path.startsWith('/admin/')) return <NotFoundPage language={language}/>

  const changeLanguage=nextLanguage=>{
    setLanguage(nextLanguage)
    localStorage.setItem('language',nextLanguage)
  }
  const renderPage=pageRoutes[path]
  const page=renderPage
    ?renderPage(language)
    :<NotFoundPage language={language}/>

  return <>
    <Navbar language={language} setLanguage={changeLanguage}/>
    {page}
    <Footer language={language}/>
  </>
}
