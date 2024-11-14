import { DetailMovie } from '@/types/movie';
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  name?: string;
  movie: DetailMovie;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, name, movie }) => {
  if (!isOpen || !movie) return null;

  const handleOuterClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleOuterClick}
    >
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{title || name}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default Modal;