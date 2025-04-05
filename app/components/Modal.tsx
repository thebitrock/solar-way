'use client';

import { useEffect } from 'react';
import { Card, Flex, Button } from '@aws-amplify/ui-react';
import { useTranslation } from '../hooks/useTranslation';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  type?: 'manufacturer' | 'solarPanel';
}

export default function Modal({ isOpen, onClose, children, title, type }: ModalProps) {
  const t = useTranslation();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl mx-auto my-4">
        <Flex direction="column" gap="1rem">
          <Flex justifyContent="space-between" alignItems="center">
            <h2 className="text-xl font-bold">{title}</h2>
            <Button onClick={onClose} variation="link">
              {t('modal.close')}
            </Button>
          </Flex>
          <div className="max-h-[70vh] overflow-y-auto pr-2">
            {children}
          </div>
        </Flex>
      </Card>
    </div>
  );
} 