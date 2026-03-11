export type Language = 'en' | 'hi';

export interface Translations {
  menu: {
    title: string;
    deities: string;
    loggedIn: string;
    muteSound: string;
    unmuteSound: string;
    logout: string;
    loginRegister: string;
    language: string;
  };
  auth: {
    welcomeBack: string;
    createAccount: string;
    username: string;
    password: string;
    enterUsername: string;
    enterPassword: string;
    processing: string;
    login: string;
    createAccountBtn: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    welcomeBackToast: string;
    loggedInAs: string;
    loginFailed: string;
    invalidCredentials: string;
    accountCreated: string;
    welcomeUser: string;
    registrationFailed: string;
    usernameTaken: string;
    invalidInput: string;
    inputRequirements: string;
  };
  game: {
    pairsCompleted: string;
    click: string;
    malas: string;
    toNextMala: string;
  };
  leaderboard: {
    leaderboard: string;
    globalLeaderboard: string;
    totalGlobalScore: string;
    pairsWorldwide: string;
    yourScore: string;
    enterName: string;
    submitting: string;
    submit: string;
    global: string;
    topWorldwide: string;
    topInCountry: string;
    noEntries: string;
    pairs: string;
  };
  deityNames: Record<string, string>;
  deityTitles: Record<string, string>;
  deityButtons: Record<string, [string, string]>;
}

const en: Translations = {
  menu: {
    title: 'MENU',
    deities: 'Deities',
    loggedIn: 'Logged in',
    muteSound: 'Mute Sound',
    unmuteSound: 'Unmute Sound',
    logout: 'Logout',
    loginRegister: 'Login / Register',
    language: 'Language',
  },
  auth: {
    welcomeBack: 'Welcome Back',
    createAccount: 'Create Account',
    username: 'Username',
    password: 'Password',
    enterUsername: 'Enter username',
    enterPassword: 'Enter password',
    processing: 'Processing...',
    login: 'Login',
    createAccountBtn: 'Create Account',
    alreadyHaveAccount: 'Already have an account? Login',
    dontHaveAccount: "Don't have an account? Register",
    welcomeBackToast: 'Welcome back!',
    loggedInAs: 'Logged in as',
    loginFailed: 'Login failed',
    invalidCredentials: 'Invalid username or password',
    accountCreated: 'Account created!',
    welcomeUser: 'Welcome,',
    registrationFailed: 'Registration failed',
    usernameTaken: 'Username may already be taken',
    invalidInput: 'Invalid input',
    inputRequirements: 'Username must be 3+ characters, password 4+ characters',
  },
  game: {
    pairsCompleted: 'PAIRS COMPLETED',
    click: 'Click',
    malas: 'MALAS',
    toNextMala: 'to next mala',
  },
  leaderboard: {
    leaderboard: 'Leaderboard',
    globalLeaderboard: 'GLOBAL LEADERBOARD',
    totalGlobalScore: 'Total Global Score',
    pairsWorldwide: 'pairs completed worldwide',
    yourScore: 'Your Score:',
    enterName: 'Enter your name...',
    submitting: 'Submitting...',
    submit: 'Submit',
    global: 'Global',
    topWorldwide: 'Top Players Worldwide',
    topInCountry: 'Top Players in',
    noEntries: 'No entries yet. Be the first to submit your score!',
    pairs: 'pairs',
  },
  deityNames: {
    krishna: 'Krishna',
    radha: 'Radha',
    rama: 'Rama',
    shivji: 'Shivji',
    hanuman: 'Hanuman',
    ganesh: 'Ganesh',
    durga: 'Durga',
    saibaba: 'Sai Baba',
    gurunanak: 'Guru Nanak',
    buddha: 'Buddha',
    mahavir: 'Mahavir',
  },
  deityTitles: {
    krishna: 'HARE KRISHNA',
    radha: 'RADHE RADHE',
    rama: 'JAI SHRI RAM',
    shivji: 'HAR HAR MAHADEV',
    hanuman: 'JAI HANUMAN',
    ganesh: 'JAI GANESH',
    durga: 'JAI MAA DURGA',
    saibaba: 'OM SAI RAM',
    gurunanak: 'WAHEGURU',
    buddha: 'OM MANI PADME HUM',
    mahavir: 'NAMO ARIHANTANAM',
  },
  deityButtons: {
    krishna: ['HARE', 'KRISHNA'],
    radha: ['RADHE', 'RADHE'],
    rama: ['JAI', 'SHRI RAM'],
    shivji: ['HAR HAR', 'MAHADEV'],
    hanuman: ['JAI', 'HANUMAN'],
    ganesh: ['JAI', 'GANESH'],
    durga: ['JAI', 'MAA DURGA'],
    saibaba: ['OM', 'SAI RAM'],
    gurunanak: ['WAHE', 'GURU'],
    buddha: ['OM', 'MANI PADME HUM'],
    mahavir: ['NAMO', 'ARIHANTANAM'],
  },
};

const hi: Translations = {
  menu: {
    title: 'मेनू',
    deities: 'देवता',
    loggedIn: 'लॉग इन',
    muteSound: 'आवाज़ बंद',
    unmuteSound: 'आवाज़ चालू',
    logout: 'लॉग आउट',
    loginRegister: 'लॉगिन / रजिस्टर',
    language: 'भाषा',
  },
  auth: {
    welcomeBack: 'वापस स्वागत है',
    createAccount: 'खाता बनाएं',
    username: 'यूज़रनेम',
    password: 'पासवर्ड',
    enterUsername: 'यूज़रनेम दर्ज करें',
    enterPassword: 'पासवर्ड दर्ज करें',
    processing: 'प्रोसेसिंग...',
    login: 'लॉगिन',
    createAccountBtn: 'खाता बनाएं',
    alreadyHaveAccount: 'पहले से खाता है? लॉगिन करें',
    dontHaveAccount: 'खाता नहीं है? रजिस्टर करें',
    welcomeBackToast: 'वापस स्वागत है!',
    loggedInAs: 'लॉग इन:',
    loginFailed: 'लॉगिन विफल',
    invalidCredentials: 'गलत यूज़रनेम या पासवर्ड',
    accountCreated: 'खाता बन गया!',
    welcomeUser: 'स्वागत है,',
    registrationFailed: 'रजिस्ट्रेशन विफल',
    usernameTaken: 'यूज़रनेम पहले से लिया जा चुका है',
    invalidInput: 'अमान्य इनपुट',
    inputRequirements: 'यूज़रनेम 3+ अक्षर, पासवर्ड 4+ अक्षर होना चाहिए',
  },
  game: {
    pairsCompleted: 'जोड़ी पूरी',
    click: 'दबाएं',
    malas: 'माला',
    toNextMala: 'अगली माला तक',
  },
  leaderboard: {
    leaderboard: 'लीडरबोर्ड',
    globalLeaderboard: 'वैश्विक लीडरबोर्ड',
    totalGlobalScore: 'कुल वैश्विक स्कोर',
    pairsWorldwide: 'दुनिया भर में जोड़ी पूरी',
    yourScore: 'आपका स्कोर:',
    enterName: 'अपना नाम दर्ज करें...',
    submitting: 'भेज रहे हैं...',
    submit: 'भेजें',
    global: 'वैश्विक',
    topWorldwide: 'दुनिया के टॉप खिलाड़ी',
    topInCountry: 'टॉप खिलाड़ी:',
    noEntries: 'अभी कोई नहीं है। पहले स्कोर जमा करें!',
    pairs: 'जोड़ी',
  },
  deityNames: {
    krishna: 'कृष्ण',
    radha: 'राधा',
    rama: 'राम',
    shivji: 'शिवजी',
    hanuman: 'हनुमान',
    ganesh: 'गणेश',
    durga: 'दुर्गा',
    saibaba: 'साई बाबा',
    gurunanak: 'गुरु नानक',
    buddha: 'बुद्ध',
    mahavir: 'महावीर',
  },
  deityTitles: {
    krishna: 'हरे कृष्ण',
    radha: 'राधे राधे',
    rama: 'जय श्री राम',
    shivji: 'हर हर महादेव',
    hanuman: 'जय हनुमान',
    ganesh: 'जय गणेश',
    durga: 'जय माँ दुर्गा',
    saibaba: 'ॐ साई राम',
    gurunanak: 'वाहेगुरु',
    buddha: 'ॐ मणि पद्मे हूँ',
    mahavir: 'नमो अरिहंतानम',
  },
  deityButtons: {
    krishna: ['हरे', 'कृष्ण'],
    radha: ['राधे', 'राधे'],
    rama: ['जय', 'श्री राम'],
    shivji: ['हर हर', 'महादेव'],
    hanuman: ['जय', 'हनुमान'],
    ganesh: ['जय', 'गणेश'],
    durga: ['जय', 'माँ दुर्गा'],
    saibaba: ['ॐ', 'साई राम'],
    gurunanak: ['वाहे', 'गुरु'],
    buddha: ['ॐ', 'मणि पद्मे हूँ'],
    mahavir: ['नमो', 'अरिहंतानम'],
  },
};

export const translations: Record<Language, Translations> = { en, hi };

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}
