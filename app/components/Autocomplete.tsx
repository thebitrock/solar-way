'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, Flex, Input, Label, Text } from '@aws-amplify/ui-react';

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
  label
}: AutocompleteProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState<T[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = items.filter(item =>
      getLabel(item).toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [items, value, getLabel]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      {label && <Label>{label}</Label>}
      <Input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
      />
      {isOpen && filteredItems.length > 0 && (
        <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto">
          <Flex direction="column">
            {filteredItems.map((item, index) => (
              <button
                key={index}
                className="px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => {
                  onSelect(item);
                  onChange(getLabel(item));
                  setIsOpen(false);
                }}
              >
                <Text>{getLabel(item)}</Text>
              </button>
            ))}
          </Flex>
        </Card>
      )}
    </div>
  );
} 