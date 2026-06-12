import { useState } from "react";

export const usePaginationAsync = () => {
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    setPage(page - 1);
  };

  const resetPage = () => {
    setPage(0);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (value: number) => {
    setRowsPerPage(value);
    resetPage();
  };

  return {
    // Getters
    page,
    rowsPerPage,

    // Setters
    nextPage,
    prevPage,
    resetPage,

    // Handlers
    handleChangePage,
    handleChangeRowsPerPage,
  };
};
