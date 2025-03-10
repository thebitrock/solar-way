'use client';

import { useState, useEffect, useRef } from 'react';
import { Input, Flex, Text } from '@aws-amplify/ui-react';

interface AutocompleteProps<T> {
  items: T[];
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: T) => void;
  getLabel: (item: T) => string;
  placeholder?: string;
  label?: string;
}

export default function Autocomplete<T>({
  items,
  value,
  onChange,
  onSelect,
  getLabel,
  placeholder,
  label,
}: AutocompleteProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState<T[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = items.filter((item) =>
      getLabel(item).toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [value, items, getLabel]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      {label && <Text className="mb-1">{label}</Text>}
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
      />
      {isOpen && filteredItems.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(item);
                setIsOpen(false);
              }}
            >
              {getLabel(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 