import { CLOUDINARY_IMAGE_BASE, CLOUDINARY_RAW_BASE } from '@/config/constants';
import fileMapData from '@/config/file_map.json'; 

const fileMap = fileMapData as Record<string, string>;

// Створюємо нормалізовану карту (ключі приводимо до спільного знаменника)
// Це робиться один раз при завантаженні сторінки
const normalizedFileMap: Record<string, string> = {};
Object.keys(fileMap).forEach(key => {
    // key.normalize('NFC') виправляє "розірвані" кириличні букви
    normalizedFileMap[key.normalize('NFC')] = fileMap[key];
});

export const fixLegacyContent = (htmlContent: string): string => {
  if (!htmlContent) return '';

  const replaceLink = (match: string, quote: string, path: string) => {
    const cleanPath = path.split('?')[0];
    
    // 1. Декодування + Нормалізація (Це ключовий момент!)
    let decodedPath = '';
    try {
        decodedPath = decodeURIComponent(cleanPath).normalize('NFC');
    } catch (e) {
        decodedPath = cleanPath;
    }
    
    // Переконаємось, що ключ починається зі слеша
    const lookupKey = decodedPath.startsWith('/') ? decodedPath : '/' + decodedPath;

    let finalUrl = '';

    // Шукаємо в нашій нормалізованій карті
    if (normalizedFileMap[lookupKey]) {
        // ВАРІАНТ А: Знайшли в карті (найточніший варіант)
        finalUrl = normalizedFileMap[lookupKey];
    } else {
        // ВАРІАНТ Б: Не знайшли -> Генеруємо вручну (для файлів з нормальними іменами)
        const extension = cleanPath.split('.').pop()?.toLowerCase();
        const rawExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar', '7z', 'txt', 'csv', 'pdf'];
        const isRaw = rawExtensions.includes(extension || '');
        const baseUrl = isRaw ? CLOUDINARY_RAW_BASE : CLOUDINARY_IMAGE_BASE;
        
        // Кодуємо назад для URL
        const encodedPath = decodedPath.split('/').map(part => encodeURIComponent(part)).join('/');
        finalUrl = `${baseUrl}/upload/${encodedPath}`;
    }

    // === ФІНАЛЬНИЙ ФІКС ДЛЯ PDF ===
    // Якщо посилання веде на PDF і містить /image/, додаємо скачування
    if (finalUrl.toLowerCase().endsWith('.pdf') && finalUrl.includes('/image/upload/')) {
         finalUrl = finalUrl.replace('/raw/upload/', '/image/upload/'); // Прибираємо raw якщо є
         if (!finalUrl.includes('fl_attachment')) {
            finalUrl = finalUrl.replace('/image/upload/', '/image/upload/fl_attachment/');
         }
    }

    return `${quote === 'src' ? 'src' : 'href'}="${finalUrl}"`;
  };

  // 1. Заміна старих шляхів
  let content = htmlContent.replace(/(src|href)=["']\/upload\/([^"']+)["']/g, (match, type, path) => {
     return replaceLink(match, type, path);
  });

  // 2. Ремонт існуючих Cloudinary посилань (якщо вони вже в тексті)
  content = content.replace(
    /(https:\/\/res\.cloudinary\.com\/[^"']+\/)(image\/upload\/)([^"']+\.pdf)/gi,
    (match, prefix, middle, suffix) => {
        return `${prefix}image/upload/fl_attachment/${suffix}`;
    }
  );

  return content;
};