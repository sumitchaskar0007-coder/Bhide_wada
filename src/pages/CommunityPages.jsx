import PageLayout from './PageLayout'
import {Link} from '../components/RouterLink'

const copy={
  en:{
    membership:{
      title:'Membership & Participation',
      intro:'Connect with the committee to learn how to contribute to heritage preservation and community activities.',
      label:'Get involved',
      heading:'Ways to participate',
      steps:[
        ['01','Share your interest','Tell us how you would like to support heritage, resident communication, or educational activities.'],
        ['02','Connect with the committee','Send an enquiry so the committee can share verified information about participation.'],
        ['03','Take part in activities','Join relevant community programmes when details and schedules are confirmed.']
      ],
      action:'Contact the committee →'
    },
    documents:{
      title:'Documents & Downloads',
      intro:'Official reports and public documents will be made available here after they are reviewed and approved.',
      label:'Resource centre',
      heading:'Document categories',
      pending:'No approved files available',
      categories:[
        ['Notices','Official notices and committee circulars'],
        ['Reports','Project reports and public information'],
        ['Applications','Forms and rehabilitation-related applications'],
        ['Meeting records','Approved meeting summaries and outcomes']
      ]
    }
  },
  mr:{
    membership:{
      title:'सदस्यत्व व सहभाग',
      intro:'वारसा जतन आणि समुदायाच्या उपक्रमांमध्ये सहभागी होण्याविषयी जाणून घेण्यासाठी समितीशी संपर्क साधा.',
      label:'सहभागी व्हा',
      heading:'सहभागाचे मार्ग',
      steps:[
        ['०१','आपली इच्छा कळवा','वारसा, रहिवाशांशी संवाद किंवा शैक्षणिक उपक्रमांना आपण कसा हातभार लावू इच्छिता ते सांगा.'],
        ['०२','समितीशी संपर्क साधा','सहभागाबद्दलची पडताळलेली माहिती मिळवण्यासाठी चौकशी पाठवा.'],
        ['०३','उपक्रमांत सहभागी व्हा','तपशील आणि वेळापत्रक निश्चित झाल्यावर संबंधित समुदाय उपक्रमांत सहभागी व्हा.']
      ],
      action:'समितीशी संपर्क साधा →'
    },
    documents:{
      title:'दस्तऐवज व डाउनलोड्स',
      intro:'पडताळणी व मंजुरीनंतर अधिकृत अहवाल आणि सार्वजनिक दस्तऐवज येथे उपलब्ध केले जातील.',
      label:'माहिती केंद्र',
      heading:'दस्तऐवजांचे प्रकार',
      pending:'मंजूर फाइल सध्या उपलब्ध नाही',
      categories:[
        ['सूचना','अधिकृत सूचना आणि समितीची परिपत्रके'],
        ['अहवाल','प्रकल्प अहवाल आणि सार्वजनिक माहिती'],
        ['अर्ज','अर्ज आणि पुनर्वसनाशी संबंधित फॉर्म'],
        ['बैठकींचे इतिवृत्त','मंजूर बैठकींचे सारांश आणि निष्कर्ष']
      ]
    }
  }
}

export function MembershipPage({language='mr'}){
  const t=copy[language]?.membership||copy.mr.membership
  return <PageLayout title={t.title} intro={t.intro}>
    <section className="community-membership">
      <div className="community-page-heading"><p className="eyebrow">{t.label}</p><h2>{t.heading}</h2></div>
      <div className="membership-steps">{t.steps.map(([number,title,description])=><article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
      <Link className="primary membership-contact" to="/contact">{t.action}</Link>
    </section>
  </PageLayout>
}

export function DocumentsPage({language='mr'}){
  const t=copy[language]?.documents||copy.mr.documents
  return <PageLayout title={t.title} intro={t.intro}>
    <section className="community-documents">
      <div className="community-page-heading"><p className="eyebrow">{t.label}</p><h2>{t.heading}</h2></div>
      <div className="document-categories">{t.categories.map(([title,description],index)=><article key={title}><span className="document-icon" aria-hidden="true">{['▤','▧','▣','▥'][index]}</span><div><h3>{title}</h3><p>{description}</p><small>{t.pending}</small></div></article>)}</div>
    </section>
  </PageLayout>
}
