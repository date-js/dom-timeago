import DateInterval from './DateInterval/DateInterval';

const justNow = (itemDate: DateInterval): boolean => itemDate.day === 0 && itemDate.hour === 0 && itemDate.minute === 0 && itemDate.second >= 0 && itemDate.second < 30;

const someSeconds = (itemDate: DateInterval): boolean => itemDate.day === 0 && itemDate.hour === 0 && itemDate.minute === 0 && itemDate.second >= 0 && itemDate.second < 60;

const someMinutes = (itemDate: DateInterval): boolean => itemDate.day === 0 && itemDate.hour === 0 && itemDate.minute >= 0 && itemDate.minute < 60;

const someHours = (itemDate: DateInterval): boolean => itemDate.day === 0 && itemDate.hour > 0 && itemDate.hour < 12;

const today = (itemDate: DateInterval): boolean => (new Date()).toDateString() === itemDate.date.toDateString();

const yesterday = (itemDate: DateInterval): boolean => {
  const currentDate = new Date();
  const currentDateYesterday = currentDate.setDate(currentDate.getDate() - 1);
  return new Date(currentDateYesterday).toDateString() === itemDate.date.toDateString();
};

const someDays = (itemDate: DateInterval): boolean => itemDate.day > 0 && itemDate.day < 7;

const sameYear = (itemDate: DateInterval): boolean => itemDate.date.getFullYear() === (new Date()).getFullYear();

const otherwise = (): boolean => true;

export default [
  {
    condition: justNow,
    text: {
      ar: 'الآن',
      bn: 'এইমাত্র',
      de: 'gerade eben',
      en: 'just now',
      es: 'ahora mismo',
      fr: 'à l\'instant',
      hi: 'अभी',
      id: 'baru saja',
      it: 'proprio ora',
      ja: 'たった今',
      ko: '방금',
      mr: 'आत्ताच',
      pt: 'agora mesmo',
      ru: 'только что',
      sw: 'sasa hivi',
      ta: 'இப்போதுதான்',
      te: 'ఇప్పుడే',
      tr: 'az önce',
      ur: 'ابھی',
      vi: 'vừa xong',
      zh: '刚刚'
    }
  },
  {
    condition: someSeconds,
    text: {
      ar: 'منذ %ds ثانية',
      bn: '%ds সেকেন্ড আগে',
      de: 'vor %ds Sekunde{%ds||n}',
      en: '%ds second{%ds||s} ago',
      es: 'hace %ds segundo{%ds||s}',
      fr: 'il y a %ds seconde{%ds||s}',
      hi: '%ds सेकंड पहले',
      id: '%ds detik yang lalu',
      it: '%ds second{%ds|o|i} fa',
      ja: '%ds秒前',
      ko: '%ds초 전',
      mr: '%ds सेकंदांपूर्वी',
      pt: 'há %ds segundo{%ds||s}',
      ru: '%ds секунд назад',
      sw: 'sekunde %ds zilizopita',
      ta: '%ds வினாடிகளுக்கு முன்',
      te: '%ds సెకన్ల క్రితం',
      tr: '%ds saniye önce',
      ur: '%ds سیکنڈ پہلے',
      vi: '%ds giây trước',
      zh: '%ds秒前'
    }
  },
  {
    condition: someMinutes,
    text: {
      ar: 'منذ %dm دقيقة',
      bn: '%dm মিনিট আগে',
      de: 'vor %dm Minute{%dm||n}',
      en: '%dm minute{%dm||s} ago',
      es: 'hace %dm minuto{%dm||s}',
      fr: 'il y a %dm minute{%dm||s}',
      hi: '%dm मिनट पहले',
      id: '%dm menit yang lalu',
      it: '%dm minut{%dm|o|i} fa',
      ja: '%dm分前',
      ko: '%dm분 전',
      mr: '%dm मिनिटांपूर्वी',
      pt: 'há %dm minuto{%dm||s}',
      ru: '%dm минут назад',
      sw: 'dakika %dm zilizopita',
      ta: '%dm நிமிடங்களுக்கு முன்',
      te: '%dm నిమిషాల క్రితం',
      tr: '%dm dakika önce',
      ur: '%dm منٹ پہلے',
      vi: '%dm phút trước',
      zh: '%dm分钟前'
    }
  },
  {
    condition: someHours,
    refresh: 300,
    text: {
      ar: 'منذ %dh ساعة',
      bn: '%dh ঘন্টা আগে',
      de: 'vor %dh Stunde{%dh||n}',
      en: '%dh hour{%dh||s} ago',
      es: 'hace %dh hora{%dh||s}',
      fr: 'il y a %dh heure{%dh||s}',
      hi: '%dh घंटे पहले',
      id: '%dh jam yang lalu',
      it: '%dh or{%dh|a|e} fa',
      ja: '%dh時間前',
      ko: '%dh시간 전',
      mr: '%dh तासांपूर्वी',
      pt: 'há %dh hora{%dh||s}',
      ru: '%dh час назад',
      sw: 'masaa %dh yaliyopita',
      ta: '%dh மணி நேரத்திற்கு முன்',
      te: '%dh గంటల క్రితం',
      tr: '%dh saat önce',
      ur: '%dh گھنٹے پہلے',
      vi: '%dh giờ trước',
      zh: '%dh小时前'
    }
  },
  {
    condition: today,
    refresh: 60,
    text: {
      ar: 'اليوم الساعة %H:%i',
      bn: 'আজ %H:%i টায়',
      de: 'heute um %H:%i Uhr',
      en: 'today at %H:%i',
      es: 'hoy a las %H:%i',
      fr: 'aujourd\'hui à %H\\h%i',
      hi: 'आज %H:%i बजे',
      id: 'hari ini pukul %H:%i',
      it: 'oggi alle %H:%i',
      ja: '今日 %H:%i',
      ko: '오늘 %H:%i',
      mr: 'आज %H:%i वाजता',
      pt: 'hoje às %H:%i',
      ru: 'сегодня в %H:%i',
      sw: 'leo saa %H:%i',
      ta: 'இன்று %H:%i மணிக்கு',
      te: 'నేడు %H:%i కి',
      tr: 'bugün saat %H:%i',
      ur: 'آج %H:%i بجے',
      vi: 'hôm nay lúc %H:%i',
      zh: '今天 %H:%i'
    }
  },
  {
    condition: yesterday,
    refresh: 60,
    text: {
      ar: 'أمس الساعة %H:%i',
      bn: 'গতকাল %H:%i টায়',
      de: 'gestern um %H:%i Uhr',
      en: 'yesterday at %H:%i',
      es: 'ayer a las %H:%i',
      fr: 'hier à %H\\h%i',
      hi: 'कल %H:%i बजे',
      id: 'kemarin pukul %H:%i',
      it: 'ieri alle %H:%i',
      ja: '昨日 %H:%i',
      ko: '어제 %H:%i',
      mr: 'काल %H:%i वाजता',
      pt: 'ontem às %H:%i',
      ru: 'вчера в %H:%i',
      sw: 'jana saa %H:%i',
      ta: 'நேற்று %H:%i மணிக்கு',
      te: 'నిన్న %H:%i కి',
      tr: 'dün saat %H:%i',
      ur: 'کل %H:%i بجے',
      vi: 'hôm qua lúc %H:%i',
      zh: '昨天 %H:%i'
    }
  },
  {
    condition: someDays,
    refresh: 3600,
    text: {
      ar: '%l الساعة %H:%i',
      bn: '%l %H:%i টায়',
      de: '%l um %H:%i Uhr',
      en: '%l at %H:%i',
      es: 'el %l a las %H:%i',
      fr: '%l à %H\\h%i',
      hi: '%l को %H:%i बजे',
      id: '%l pukul %H:%i',
      it: '%l alle %H:%i',
      ja: '%l %H:%i',
      ko: '%l %H:%i',
      mr: '%l रोजी %H:%i वाजता',
      pt: '%l às %H:%i',
      ru: '%l в %H:%i',
      sw: '%l saa %H:%i',
      ta: '%l %H:%i மணிக்கு',
      te: '%l %H:%i కి',
      tr: '%l saat %H:%i',
      ur: '%l کو %H:%i بجے',
      vi: '%l lúc %H:%i',
      zh: '%l %H:%i'
    }
  },
  {
    condition: sameYear,
    refresh: null,
    text: {
      ar: '%d %F',
      bn: '%d %F',
      de: '%d. %F',
      en: '%F %d',
      es: '%d de %F',
      fr: 'le %j{%j|er|} %F',
      hi: '%d %F',
      id: '%d %F',
      it: '%d %F',
      ja: '%m月%d日',
      ko: '%m월 %d일',
      mr: '%d %F',
      pt: '%d de %F',
      ru: '%d %F',
      sw: '%d %F',
      ta: '%d %F',
      te: '%d %F',
      tr: '%d %F',
      ur: '%d %F',
      vi: 'ngày %d tháng %m',
      zh: '%m月%d日'
    }
  },
  {
    condition: otherwise,
    refresh: null,
    text: {
      ar: '%d %F %Y',
      bn: '%d %F %Y',
      de: '%d. %F %Y',
      en: '%F %d, %Y',
      es: '%d de %F de %Y',
      fr: 'le %j{%j|er|} %F %Y',
      hi: '%d %F %Y',
      id: '%d %F %Y',
      it: '%d %F %Y',
      ja: '%Y年%m月%d日',
      ko: '%Y년 %m월 %d일',
      mr: '%d %F %Y',
      pt: '%d de %F de %Y',
      ru: '%d %F %Y',
      sw: '%d %F %Y',
      ta: '%d %F %Y',
      te: '%d %F %Y',
      tr: '%d %F %Y',
      ur: '%d %F %Y',
      vi: 'ngày %d tháng %m năm %Y',
      zh: '%Y年%m月%d日'
    }
  },
];
