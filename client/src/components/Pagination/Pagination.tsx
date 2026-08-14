// client/src/components/Pagination/Pagination.tsx
import React from 'react';
import Link from 'next/link';
import styles from './Pagination.module.scss';
import { PaginationProps } from '@/types'; 

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  baseUrl,
}) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (onPageChange && page >= 1 && page <= totalPages && page !== currentPage) {
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

  const renderButton = (content: React.ReactNode, page: number, disabled: boolean = false, active: boolean = false) => {
    const className = `${styles.pageBtn} ${active ? styles.active : ''}`.trim();
    
    if (disabled) {
      return (
        <button className={className} disabled>
          {content}
        </button>
      );
    }

    if (baseUrl) {
      return (
        <Link href={`${baseUrl}?page=${page}`} className={className}>
          {content}
        </Link>
      );
    }

    return (
      <button
        className={className}
        onClick={() => handlePageChange(page)}
      >
        {content}
      </button>
    );
  };

  return (
    <div className={styles.paginationContainer}>
      
      {/* Кнопка "Перша" */}
      {renderButton('Перша', 1, currentPage === 1)}

      {/* Кнопка "Попередня" */}
      {renderButton('Попередня', currentPage - 1, currentPage === 1)}

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
          <React.Fragment key={index}>
            {renderButton(number, number as number, false, currentPage === number)}
          </React.Fragment>
        );
      })}

      {/* Кнопка "Наступна" */}
      {renderButton('Наступна', currentPage + 1, currentPage === totalPages)}

      {/* Кнопка "Остання" */}
      {renderButton('Остання', totalPages, currentPage === totalPages)}

    </div>
  );
};

export default Pagination;