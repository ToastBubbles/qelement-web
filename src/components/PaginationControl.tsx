import React from "react";
interface IProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
export default function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
}: IProps) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const goToFirstPage = () => {
    if (!isFirstPage) {
      onPageChange(1);
    }
  };

  const goToPreviousPage = () => {
    if (!isFirstPage) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (!isLastPage) {
      onPageChange(currentPage + 1);
    }
  };

  const goToLastPage = () => {
    if (!isLastPage) {
      onPageChange(totalPages);
    }
  };

  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination">
      {/* <button onClick={goToFirstPage} disabled={isFirstPage}>
        First
      </button>
      <button onClick={goToPreviousPage} disabled={isFirstPage}>
        Previous
      </button>
      <span>
        {currentPage} / {totalPages}
      </span>
      <button onClick={goToNextPage} disabled={isLastPage}>
        Next
      </button>
      <button onClick={goToLastPage} disabled={isLastPage}>
        Last
      </button> */}
      <div className="w-20 d-flex jc-space-b">
        <button onClick={goToPreviousPage} disabled={isFirstPage}>
          {"<"}
        </button>
        <div className="d-flex">
          <div onClick={goToFirstPage} className={"page" + (currentPage == 1 ? " red-txt" : " clickable")}>1</div>
          {currentPage - 2 > 1 && <div className="page grey-txt">...</div>}
          {currentPage - 1 > 1 && <div onClick={goToPreviousPage} className="page clickable">{currentPage - 1}</div>}
          {currentPage !== 1 && currentPage !== totalPages && (
            <div className="red-txt page">{currentPage}</div>
          )}
          {currentPage + 1 < totalPages && (
            <div onClick={goToNextPage} className="page clickable">{currentPage + 1}</div>
          )}
          {currentPage + 2 < totalPages && (
            <div className="page grey-txt">...</div>
          )}
          <div
            onClick={goToLastPage} className={"page" + (currentPage == totalPages ? " red-txt" : " clickable")}
          >
            {totalPages}
          </div>
        </div>
        <button onClick={goToNextPage} disabled={isLastPage}>
          {">"}
        </button>
      </div>
    </div>
  );
}
