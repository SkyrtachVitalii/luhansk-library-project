// client/src/components/Pagination/Pagination.tsx
import React from 'react';
import styles from './Pagination.module.scss';
import { PaginationProps } from '@/types/layout.types'; 

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);
    if (currentPage > 4) pages.push('...');

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) pages.push(i);
    }

    if (currentPage < totalPages - 3) pages.push('...');
    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={styles.paginationContainer}>
      
      {/* Кнопка "Перша" */}
      <button
        className={styles.pageBtn}
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      >
        Перша
      </button>

      {/* Кнопка "Попередня" */}
      <button
        className={styles.pageBtn}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Попередня
      </button>

      {/* Цифри */}
      {pageNumbers.map((number, index) => {
        if (number === '...') {
          return (
            <span key={`dots-${index}`} className={styles.dots}>
              ...
            </span>
          );
        }

        return (
          <button
            key={index}
            className={`${styles.pageBtn} ${
              currentPage === number ? styles.active : ''
            }`}
            onClick={() => handlePageChange(number as number)}
          >
            {number}
          </button>
        );
      })}

      {/* Кнопка "Наступна" */}
      <button
        className={styles.pageBtn}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Наступна
      </button>

      {/* Кнопка "Остання" */}
      <button
        className={styles.pageBtn}
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        Остання
      </button>

    </div>
  );
};

export default Pagination;