import React, { useState, useEffect } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const Pagination = ({ setPagnitionState, setPagnitionStateEnd }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 6;
  const studentsPerPage = 10;

  useEffect(() => {
    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    setPagnitionState(startIndex);
    setPagnitionStateEnd(endIndex);
  }, [currentPage, setPagnitionState, setPagnitionStateEnd]);

  const renderPaginationButton = (pageNumber) => {
    const isActive = pageNumber === currentPage;
    return (
      <button
        key={pageNumber}
        onClick={() => setCurrentPage(pageNumber)}
        className={`w-8 h-8 flex items-center justify-center rounded-full ${
          isActive
            ? "bg-blue-50 text-blue-600"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        {pageNumber}
      </button>
    );
  };

  return (
    <div className="flex items-center justify-center gap-1 p-4 border-t">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-50"
      >
        <MdChevronLeft className="w-4 h-4" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
        renderPaginationButton
      )}

      <button
        onClick={() =>
          setCurrentPage((prev) => Math.min(totalPages, prev + 1))
        }
        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-50"
      >
        <MdChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
