export default function HeritagePortraits({language='mr'}){
  const en=language==='en'
  return <div className="reference-heritage" role="group" aria-label={en?'Our heritage and inspiration':'आपला वारसा व प्रेरणास्थाने'}>
    <img className="reference-portraits" src="/assets/images/header1.png" width="1600" height="533" alt={en?'Chhatrapati Shivaji Maharaj, Mahatma Jyotirao Phule, Krantijyoti Savitribai Phule, Rajarshi Shahu Maharaj, Dr. Babasaheb Ambedkar and Annabhau Sathe':'छत्रपती शिवाजी महाराज, महात्मा ज्योतिराव फुले, क्रांतिज्योती सावित्रीबाई फुले, राजर्षी शाहू महाराज, डॉ. बाबासाहेब आंबेडकर आणि अण्णाभाऊ साठे'} decoding="async"/>
  </div>
}
