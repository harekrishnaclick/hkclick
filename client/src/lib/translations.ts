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
  nav: {
    chant: string;
    stats: string;
    deities: string;
    ranks: string;
    navigation: string;
    selectFocus: string;
    choosePath: string;
    divineGallery: string;
    selected: string;
    chantWith: string;
  };
  game: {
    pairsCompleted: string;
    click: string;
    malas: string;
    toNextMala: string;
    currentSession: string;
    pairsToNextMala: string;
    malaCompletedSingle: string;
    malaCompletedPlural: string;
    malaCompleteTitle: string;
    focusTime: string;
    dailyRank: string;
    energy: string;
    pure: string;
    endSession: string;
    saving: string;
    shareScore: string;
    viewLeaderboard: string;
    streakBanner: string;
    copiedToClipboard: string;
    shareWithFriends: string;
    dailyGoalLabel: string;
    dailyGoalReached: string;
    pairsLeftToday: string;
    dailyGoalToastTitle: string;
    dailyGoalToastDesc: string;
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
  stats: {
    title: string;
    subtitle: string;
    dailyGoal: string;
    weeklyActivity: string;
    sacredMilestones: string;
    totalBeads: string;
    longestStreak: string;
    totalMalas: string;
    spiritualLevel: string;
    chantingHistory: string;
    personalRecords: string;
    fastestMala: string;
    bestSession: string;
    earlyBird: string;
    sessionsBefore5am: string;
    notYetSet: string;
    continueJourney: string;
    startChanting: string;
    pairsToday: string;
    dayStreak: string;
    mala: string;
    malas: string;
    pairs: string;
    justNow: string;
    agoSuffix: string;
    goalReached: string;
    pairsLeftToday: string;
    days: string[];
    level: string;
  };
  deityNames: Record<string, string>;
  deityTitles: Record<string, string>;
  deityButtons: Record<string, [string, string]>;
  deityTaglines: Record<string, string>;
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
  nav: {
    chant: 'Chant',
    stats: 'Stats',
    deities: 'Deities',
    ranks: 'Ranks',
    navigation: 'NAVIGATION',
    selectFocus: 'Select your focus',
    choosePath: 'Choose Your Path',
    divineGallery: 'Divine Gallery',
    selected: 'SELECTED',
    chantWith: 'Chant',
  },
  game: {
    pairsCompleted: 'PAIRS COMPLETED',
    click: 'Click',
    malas: 'MALAS',
    toNextMala: 'to next mala',
    currentSession: 'Current Session',
    pairsToNextMala: 'pairs to next mala',
    malaCompletedSingle: 'mala completed',
    malaCompletedPlural: 'malas completed',
    malaCompleteTitle: '🙏 Mala Complete!',
    focusTime: 'FOCUS TIME',
    dailyRank: 'DAILY RANK',
    energy: 'ENERGY',
    pure: 'Pure',
    endSession: 'End Session & Save Score',
    saving: 'Saving...',
    shareScore: 'Share Score',
    viewLeaderboard: 'View Leaderboard & Submit Score',
    streakBanner: "🔥 You haven't chanted today — keep your streak alive!",
    copiedToClipboard: 'Copied to clipboard!',
    shareWithFriends: 'Share your score with friends 🙏',
    dailyGoalLabel: 'Daily Goal',
    dailyGoalReached: '🎉 Daily goal reached!',
    pairsLeftToday: 'pairs left today',
    dailyGoalToastTitle: '🎉 Daily goal reached!',
    dailyGoalToastDesc: "You've chanted {n} pairs today — goal complete!",
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
  stats: {
    title: 'Progress & Stats',
    subtitle: 'Your Spiritual Journey',
    dailyGoal: 'Daily Goal',
    weeklyActivity: 'Weekly Activity',
    sacredMilestones: 'Sacred Milestones',
    totalBeads: 'Total Beads',
    longestStreak: 'Longest Streak',
    totalMalas: 'Total Malas',
    spiritualLevel: 'Spiritual Level',
    chantingHistory: 'Chanting History',
    personalRecords: 'Personal Records',
    fastestMala: 'Fastest Mala',
    bestSession: 'Best Session',
    earlyBird: 'Early Bird',
    sessionsBefore5am: 'Sessions before 5am',
    notYetSet: 'Not yet set',
    continueJourney: 'Continue Journey',
    startChanting: 'Start chanting to see your history here',
    pairsToday: 'pairs today',
    dayStreak: 'day streak 🔥',
    mala: 'mala',
    malas: 'malas',
    pairs: 'pairs',
    justNow: 'just now',
    agoSuffix: 'ago',
    goalReached: '🎉 Daily goal reached!',
    pairsLeftToday: 'pairs left today',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    level: 'Lv',
  },
  deityNames: {
    krishna: 'Krishna',
    radha: 'Radha',
    rama: 'Rama',
    shivji: 'Shivji',
    hanuman: 'Hanuman',
    ganesh: 'Ganesh',
    durga: 'Durga',
  },
  deityTitles: {
    krishna: 'HARE KRISHNA',
    radha: 'RADHE RADHE',
    rama: 'JAI SHRI RAM',
    shivji: 'HAR HAR MAHADEV',
    hanuman: 'JAI HANUMAN',
    ganesh: 'JAI GANESH',
    durga: 'JAI MAA DURGA',
  },
  deityButtons: {
    krishna: ['HARE', 'KRISHNA'],
    radha: ['RADHE', 'RADHE'],
    rama: ['JAI', 'SHRI RAM'],
    shivji: ['HAR HAR', 'MAHADEV'],
    hanuman: ['JAI', 'HANUMAN'],
    ganesh: ['JAI', 'GANESH'],
    durga: ['JAI', 'MAA DURGA'],
  },
  deityTaglines: {
    krishna: 'The Cosmic Enchanter',
    radha: 'Divine Love Personified',
    rama: 'The Eternal Guardian',
    shivji: 'The Eternal Meditator',
    hanuman: 'The Strength of Devotion',
    ganesh: 'Remover of Obstacles',
    durga: 'The Invincible Mother',
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
  nav: {
    chant: 'जप',
    stats: 'आँकड़े',
    deities: 'देवता',
    ranks: 'रैंकिंग',
    navigation: 'नेविगेशन',
    selectFocus: 'अपनी साधना चुनें',
    choosePath: 'अपना मार्ग चुनें',
    divineGallery: 'देव दर्शन',
    selected: 'चयनित',
    chantWith: 'जप करें',
  },
  game: {
    pairsCompleted: 'जोड़ी पूरी',
    click: 'दबाएं',
    malas: 'माला',
    toNextMala: 'अगली माला तक',
    currentSession: 'वर्तमान सत्र',
    pairsToNextMala: 'अगली माला तक जोड़ी',
    malaCompletedSingle: 'माला पूरी हुई',
    malaCompletedPlural: 'माला पूरी हुई',
    malaCompleteTitle: '🙏 माला पूरी!',
    focusTime: 'साधना समय',
    dailyRank: 'दैनिक रैंक',
    energy: 'ऊर्जा',
    pure: 'पवित्र',
    endSession: 'सत्र समाप्त करें और स्कोर सहेजें',
    saving: 'सहेज रहे हैं...',
    shareScore: 'स्कोर शेयर करें',
    viewLeaderboard: 'लीडरबोर्ड देखें और स्कोर जमा करें',
    streakBanner: '🔥 आज जप नहीं किया — अपनी लकीर बनाए रखें!',
    copiedToClipboard: 'क्लिपबोर्ड पर कॉपी हुआ!',
    shareWithFriends: 'अपना स्कोर दोस्तों के साथ शेयर करें 🙏',
    dailyGoalLabel: 'दैनिक लक्ष्य',
    dailyGoalReached: '🎉 दैनिक लक्ष्य पूरा!',
    pairsLeftToday: 'जोड़ी बाकी आज',
    dailyGoalToastTitle: '🎉 दैनिक लक्ष्य पूरा!',
    dailyGoalToastDesc: 'आज {n} जोड़ी जप किया — लक्ष्य पूरा!',
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
  stats: {
    title: 'प्रगति और आँकड़े',
    subtitle: 'आपकी आध्यात्मिक यात्रा',
    dailyGoal: 'दैनिक लक्ष्य',
    weeklyActivity: 'साप्ताहिक गतिविधि',
    sacredMilestones: 'पवित्र पड़ाव',
    totalBeads: 'कुल मनके',
    longestStreak: 'सबसे लंबी लकीर',
    totalMalas: 'कुल माला',
    spiritualLevel: 'आध्यात्मिक स्तर',
    chantingHistory: 'जप इतिहास',
    personalRecords: 'व्यक्तिगत रिकॉर्ड',
    fastestMala: 'सबसे तेज़ माला',
    bestSession: 'सर्वश्रेष्ठ सत्र',
    earlyBird: 'सुबह की साधना',
    sessionsBefore5am: 'सुबह 5 बजे से पहले',
    notYetSet: 'अभी तक नहीं',
    continueJourney: 'साधना जारी रखें',
    startChanting: 'यहाँ इतिहास देखने के लिए जप शुरू करें',
    pairsToday: 'जोड़ी आज',
    dayStreak: 'दिन की लकीर 🔥',
    mala: 'माला',
    malas: 'माला',
    pairs: 'जोड़ी',
    justNow: 'अभी',
    agoSuffix: 'पहले',
    goalReached: '🎉 दैनिक लक्ष्य पूरा!',
    pairsLeftToday: 'जोड़ी बाकी आज',
    days: ['सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि'],
    level: 'स्तर',
  },
  deityNames: {
    krishna: 'कृष्ण',
    radha: 'राधा',
    rama: 'राम',
    shivji: 'शिवजी',
    hanuman: 'हनुमान',
    ganesh: 'गणेश',
    durga: 'दुर्गा',
  },
  deityTitles: {
    krishna: 'हरे कृष्ण',
    radha: 'राधे राधे',
    rama: 'जय श्री राम',
    shivji: 'हर हर महादेव',
    hanuman: 'जय हनुमान',
    ganesh: 'जय गणेश',
    durga: 'जय माँ दुर्गा',
  },
  deityButtons: {
    krishna: ['हरे', 'कृष्ण'],
    radha: ['राधे', 'राधे'],
    rama: ['जय', 'श्री राम'],
    shivji: ['हर हर', 'महादेव'],
    hanuman: ['जय', 'हनुमान'],
    ganesh: ['जय', 'गणेश'],
    durga: ['जय', 'माँ दुर्गा'],
  },
  deityTaglines: {
    krishna: 'ब्रह्मांड के आकर्षण',
    radha: 'दिव्य प्रेम का स्वरूप',
    rama: 'शाश्वत रक्षक',
    shivji: 'शाश्वत ध्यानी',
    hanuman: 'भक्ति की शक्ति',
    ganesh: 'विघ्नहर्ता',
    durga: 'अजेय माँ',
  },
};

export const translations: Record<Language, Translations> = { en, hi };

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}
