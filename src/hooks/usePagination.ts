import { useState } from 'react';

export function usePagination({ pageSize, totalItems }: { pageSize: number; totalItems: number }) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const [currentPage, setCurrentPage] = useState(1);

  const goToNextPage = () => {
    if (currentPage === totalPages) return;
    setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage === 1) return;
    setCurrentPage(currentPage - 1);
  };

  return {
    currentPage,
    goToNextPage,
    goToPreviousPage,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === Math.ceil(totalItems / pageSize),
    pageSize,
    totalPages,
  };
}
