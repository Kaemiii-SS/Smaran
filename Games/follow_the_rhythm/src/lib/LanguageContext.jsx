"use client";

import React, { createContext, useContext, useState } from 'react';

export const TRANSLATIONS = {
  'en-IN': {
    name: 'English',
    title: 'Follow the rhythm',
    subtitle: 'A gentle musical memory game.',
    playNow: 'Play Now',
    howToPlay: 'How to Play',
    desc1: 'Smaran is designed to be a calming, shame-free experience. Watch the colored orbs light up and listen to their soothing tones. Once the sequence is complete, gently tap the orbs to repeat the pattern.',
    desc2: 'There are no buzzers or penalties for mistakes. If you tap the wrong color, the game will softly encourage you to try again. Take your time, enjoy the music, and find your flow state.',
    rest: 'Rest',
    level: 'Level',
    start: 'Start',
    resume: 'Resume',
    easy: 'easy',
    medium: 'medium',
    hard: 'hard',
    voiceListen: 'Listen carefully...',
    voiceTurn: "Now it's your turn.",
    voiceWonderful: 'Wonderful!',
    voiceComplete: "You've completed this difficulty! Great job.",
    voiceBreak: 'Taking a break is a great idea. See you later!',
    voiceListenAgain: "Let's listen again.",
    voiceWelcome: 'Welcome to Smaran!'
  },
  'hi-IN': {
    name: 'हिन्दी (Hindi)',
    title: 'लय के साथ चलें',
    subtitle: 'एक शांत संगीतमय स्मृति खेल।',
    playNow: 'अभी खेलें',
    howToPlay: 'कैसे खेलें',
    desc1: 'स्मरण को एक शांत, शर्म-मुक्त अनुभव के लिए डिज़ाइन किया गया है। रंगीन गोलों को चमकते हुए देखें और उनकी सुखदायक आवाज़ें सुनें। अनुक्रम पूरा होने के बाद, पैटर्न को दोहराने के लिए गोलों को धीरे से टैप करें।',
    desc2: 'ग़लतियों के लिए कोई सज़ा या बज़र नहीं है। यदि आप ग़लत रंग टैप करते हैं, तो खेल आपको फिर से प्रयास करने के लिए कोमलता से प्रोत्साहित करेगा। अपना समय लें, संगीत का आनंद लें।',
    rest: 'विराम',
    level: 'स्तर',
    start: 'शुरू करें',
    resume: 'फिर से शुरू करें',
    easy: 'आसान',
    medium: 'मध्यम',
    hard: 'कठिन',
    voiceListen: 'ध्यान से सुनें...',
    voiceTurn: 'अब आपकी बारी।',
    voiceWonderful: 'बहुत बढ़िया!',
    voiceComplete: 'आपने इस स्तर को पूरा कर लिया है! शाबाश।',
    voiceBreak: 'थोड़ा आराम करना अच्छा है। फिर मिलेंगे!',
    voiceListenAgain: 'आइए फिर से सुनें।'
  },
  'mr-IN': {
    name: 'मराठी (Marathi)',
    title: 'तालावर चला',
    subtitle: 'एक शांत संगीतमय स्मरणशक्ती खेळ.',
    playNow: 'आता खेळा',
    howToPlay: 'कसे खेळायचे',
    desc1: 'स्मरण हा एक शांत, लाज-मुक्त अनुभव म्हणून डिझाइन केला आहे. रंगीत गोल चमकताना पहा आणि त्यांचे शांत आवाज ऐका. क्रम पूर्ण झाल्यावर, पॅटर्नची पुनरावृत्ती करण्यासाठी गोलांना हळूवारपणे टॅप करा.',
    desc2: 'चुकांसाठी कोणतीही शिक्षा किंवा बजर नाही. जर तुम्ही चुकीच्या रंगावर टॅप केले, तर खेळ तुम्हाला पुन्हा प्रयत्न करण्यास प्रेमाने प्रोत्साहित करेल. आपला वेळ घ्या, संगीताचा आनंद घ्या.',
    rest: 'थांबा',
    level: 'पातळी',
    start: 'सुरू करा',
    resume: 'पुन्हा सुरू करा',
    easy: 'सोपे',
    medium: 'मध्यम',
    hard: 'कठीण',
    voiceListen: 'लक्ष देऊन ऐका...',
    voiceTurn: 'आता तुमची पाळी.',
    voiceWonderful: 'उत्तम!',
    voiceComplete: 'तुम्ही ही पातळी पूर्ण केली आहे! खूप छान.',
    voiceBreak: 'विश्रांती घेणे ही चांगली कल्पना आहे. पुन्हा भेटू!',
    voiceListenAgain: 'चला पुन्हा ऐकूया.'
  },
  'bn-IN': {
    name: 'বাংলা (Bengali)',
    title: 'ছন্দ অনুসরণ করুন',
    subtitle: 'একটি শান্ত সংগীতে মেমরি গেম।',
    playNow: 'এখন খেলুন',
    howToPlay: 'কীভাবে খেলবেন',
    desc1: 'স্মরণ একটি শান্ত এবং লজ্জামুক্ত অভিজ্ঞতা দেওয়ার জন্য ডিজাইন করা হয়েছে। রঙিন গোলকগুলো জ্বলতে দেখুন এবং তাদের প্রশান্তিদায়ক শব্দ শুনুন। ক্রমটি শেষ হওয়ার পরে, প্যাটার্নটি পুনরাবৃত্তি করতে গোলকগুলোতে আলতো করে আলতো চাপুন।',
    desc2: 'ভুলের জন্য কোন শাস্তি বা বজার নেই। আপনি যদি ভুল রঙে ট্যাপ করেন, তাহলে গেমটি আপনাকে আস্তে করে আবার চেষ্টা করতে উৎসাহিত করবে। আপনার সময় নিন, সংগীত উপভোগ করুন।',
    rest: 'বিরতি',
    level: 'স্তর',
    start: 'শুরু করুন',
    resume: 'পুনরায় শুরু',
    easy: 'সহজ',
    medium: 'মাঝারি',
    hard: 'কঠিন',
    voiceListen: 'মনোযোগ দিয়ে শুনুন...',
    voiceTurn: 'এখন আপনার পালা।',
    voiceWonderful: 'অসাধারণ!',
    voiceComplete: 'আপনি এই স্তরটি শেষ করেছেন! খুব ভালো।',
    voiceBreak: 'বিশ্রাম নেওয়া ভালো। আবার দেখা হবে!',
    voiceListenAgain: 'আসুন আবার শুনি।'
  },
  'as-IN': {
    name: 'অসমীয়া (Assamese)',
    title: 'তাল অনুসৰণ কৰক',
    subtitle: 'এটি শান্ত সংগীতৰ স্মৃতিৰ খেল।',
    playNow: 'খেলক',
    howToPlay: 'কেনেদৰে খেলিব',
    desc1: 'স্মৰণক এক শান্ত আৰু লাজ-মুক্ত অভিজ্ঞতা হ\'বলৈ ডিজাইন কৰা হৈছে। ৰঙীন গোলকবোৰ জ্বলি উঠা চাওক আৰু সিহঁতৰ শান্ত শব্দ শুনক। ক্ৰমটো শেষ হোৱাৰ পাছত, পেটাৰ্ণটো পুনৰাবৃত্তি কৰিবলৈ গোলকবোৰত লাহেকৈ টিপক।',
    desc2: 'ভুলৰ বাবে কোনো শাস্তি বা বাজাৰ নাই। যদি আপুনি ভুল ৰঙত টিপে, তেন্তে গেমটোৱে আপোনাক লাহেকৈ পুনৰ চেষ্টা কৰিবলৈ উৎসাহিত কৰিব। আপোনাৰ সময় লওক, সংগীত উপভোগ কৰক।',
    rest: 'বিৰতি',
    level: 'স্তৰ',
    start: 'আৰম্ভ কৰক',
    resume: 'পুনৰ আৰম্ভ কৰক',
    easy: 'সহজ',
    medium: 'মধ্যমীয়া',
    hard: 'কঠিন',
    voiceListen: 'মনোযোগ দি শুনক...',
    voiceTurn: 'এতিয়া আপোনাৰ পাল।',
    voiceWonderful: 'অসাধাৰণ!',
    voiceComplete: 'আপুনি এই স্তৰটো সম্পূৰ্ণ কৰিলে! খুব ভাল।',
    voiceBreak: 'বিৰাম লোৱাটো ভাল। পুনৰ লগ পাম!',
    voiceListenAgain: 'আহক পুনৰ শুনোঁ।'
  }
};

const LanguageContext = createContext(undefined);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en-IN');

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: TRANSLATIONS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
