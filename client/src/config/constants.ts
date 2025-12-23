export const MIN_PRELOADER_TIME = 2000;
export const SCROLL_DELAY = MIN_PRELOADER_TIME + 100; // Автоматично 2100




const CLOUD_NAME = "dlptdeuqh"; // Ваш cloud name
const FOLDER_PATH = "library_archive_main"; // Ваша папка

// Базовий шлях для Картинок та PDF (бо PDF це теж image у Cloudinary)
export const CLOUDINARY_IMAGE_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1/${FOLDER_PATH}`;

// Базовий шлях для "Сирих" файлів (DOC, ZIP, RAR, XLS)
export const CLOUDINARY_RAW_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/raw/upload/v1/${FOLDER_PATH}`;


// export const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dlptdeuqh/image/upload/v1765018777/library_archive_main";