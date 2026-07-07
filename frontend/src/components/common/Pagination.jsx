import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Button from './Button';
export default function Pagination({ currentPage, totalPages, onPageChange, className }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Button variant="ghost" size="sm" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} icon={<FaChevronLeft />} className="text-industrial-400">Prev</Button>
      <div className="flex gap-1">
        {pages.map(page => (
          <Button key={page} variant={currentPage === page ? 'secondary' : 'ghost'} size="sm" onClick={() => onPageChange(page)} className={`w-8 h-8 p-0 flex items-center justify-center rounded-md ${currentPage === page ? 'bg-industrial-800 border-industrial-700 text-industrial-100' : 'text-industrial-400'}`}>{page}</Button>
        ))}
      </div>
      <Button variant="ghost" size="sm" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} className="text-industrial-400">Next <FaChevronRight className="ml-2" /></Button>
    </div>
  );
}