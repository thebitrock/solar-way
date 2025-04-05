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
  onSubmit?: () => void;
}

export default function Modal({ isOpen, onClose, children, title, type, onSubmit }: ModalProps) {
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
      <Card className="w-full max-w-4xl mx-auto my-8 flex flex-col">
        <Flex direction="column" className="h-[80vh]">
          {/* Header */}
          <Flex justifyContent="space-between" alignItems="center" className="px-4 py-3 border-b">
            <h4 className="text-2xl font-bold">{title}</h4>
            <Button onClick={onClose} variation="link">
              {t('modal.close')}
            </Button>
          </Flex>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {children}
          </div>
          
          {/* Footer */}
          <div className="px-4 py-3 border-t bg-white">
            <Flex justifyContent="flex-end" gap="1rem">
              <Button variation="link" onClick={onClose}>
                {t('solarPanels.cancel')}
              </Button>
              <Button variation="primary" onClick={onSubmit}>
                {type === 'manufacturer' ? t('manufacturers.update') : t('solarPanels.update')}
              </Button>
            </Flex>
          </div>
        </Flex>
      </Card>
    </div>
  );
} 