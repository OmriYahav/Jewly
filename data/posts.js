export const forumCategories = [
  { key: "scoops", label: "סקופים" },
  { key: "media", label: "ביקורת תקשורת" },
  { key: "politics", label: "פוליטיקה ואקטואליה" },
  { key: "opinion", label: "יש לי מה לומר" },
  { key: "torah", label: "בית המדרש" },
  { key: "law", label: "משפטים" }
];

export const posts = [
  {
    id: "1",
    category: "scoops",
    title: "דיווח מיוחד: עדכון חשוב מהשטח",
    author: "rotter1",
    views: 18234,
    comments: 162,
    time: "לפני שעה",
    content:
      "עדכון חם מהשטח עם כל הפרטים החשובים. ההתרחשות המרכזית תתעדכן כאן בזמן אמת לכל החברים בקהילה."
  },
  {
    id: "2",
    category: "politics",
    title: "פאנל מיוחד: השלכות ההצעה החדשה",
    author: "analyst",
    views: 9321,
    comments: 88,
    time: "לפני שעתיים",
    content:
      "מה המשמעות של ההצעה החדשה על סדר היום הפוליטי? ניתוח מעמיק של מיטב הכותבים בפורום."
  },
  {
    id: "3",
    category: "media",
    title: "ביקורת חריפה על סיקור התקשורת",
    author: "mediawatch",
    views: 12044,
    comments: 203,
    time: "לפני 3 שעות",
    content:
      "האם התקשורת מייצגת את כל הצדדים? משתמשים שיתפו חוויות וסיפורים מהשבוע האחרון."
  },
  {
    id: "4",
    category: "opinion",
    title: "פוסט אישי: למה חשוב לדבר",
    author: "voice",
    views: 5400,
    comments: 45,
    time: "לפני יום",
    content:
      "פוסט אישי ומרגש על חשיבות השיח הפתוח בפורום והקהילה המיוחדת שנבנתה כאן."
  },
  {
    id: "5",
    category: "torah",
    title: "שיעור מרתק מאתמול בערב",
    author: "torahlearner",
    views: 3711,
    comments: 29,
    time: "לפני יומיים",
    content:
      "סיכום שיעור מיוחד בנושא פרשת השבוע והמסרים הנצחיים שלה לחיים שלנו היום."
  },
  {
    id: "6",
    category: "law",
    title: "התייעצות: איך להתנהל מול תביעה?",
    author: "lawhelp",
    views: 2640,
    comments: 12,
    time: "לפני 4 שעות",
    content:
      "דיון פתוח לגבי צעדים שכדאי לבצע כאשר מקבלים תביעה אזרחית והמלצות מעורכי דין שבקהילה."
  }
];

export const comments = {
  "1": [
    {
      id: "c1",
      author: "forumer",
      time: "לפני 20 דקות",
      text: "תודה על העדכון! מחכה לפרטים נוספים." 
    },
    {
      id: "c2",
      author: "someone",
      time: "לפני 10 דקות",
      text: "מדהים לראות איך הפורום מתעדכן מהר כל כך." 
    }
  ],
  "2": [
    {
      id: "c3",
      author: "debater",
      time: "לפני שעה",
      text: "ההצעה הזו משנה את כללי המשחק, צריך לעקוב." 
    }
  ],
  "3": [
    {
      id: "c4",
      author: "critic",
      time: "לפני 50 דקות",
      text: "התקשורת שוב מפספסת את העיקר, אנחנו כאן כדי להזכיר." 
    }
  ]
};
