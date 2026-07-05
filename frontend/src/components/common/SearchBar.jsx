import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Input from './Input';
import { cn } from '../../utils/cn';
export default function SearchBar({ onSearch, placeholder = 'Search...', debounceMs = 300, className, ...props }) {
  const [query, setQuery] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => { if (onSearch) onSearch(query); }, debounceMs);
    return () => clearTimeout(handler);
  }, [query, onSearch, debounceMs]);
  return (
    <div className={cn('relative w-full max-w-md', className)}>
      <Input type="text" placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} iconLeft={<FaSearch />} className={query ? 'pr-10' : ''} {...props} />
      {query && <button className="absolute right-3 top-1/2 -translate-y-1/2 text-industrial-400 hover:text-white" onClick={() => setQuery('')}><FaTimes /></button>}
    </div>
  );
}