'use client';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

function Modal({ isOpen, onClose, title, message, type }: ModalProps) {
  if (!isOpen) return null;

  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      titleColor: 'text-green-800',
      messageColor: 'text-green-700',
      icon: '✅'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      titleColor: 'text-red-800',
      messageColor: 'text-red-700',
      icon: '❌'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-700',
      icon: 'ℹ️'
    }
  };

  const style = typeStyles[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${style.bg} border ${style.border} rounded-lg p-6 max-w-md w-full mx-4`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">{style.icon}</span>
            <div>
              <h3 className={`text-lg font-semibold ${style.titleColor}`}>
                {title}
              </h3>
              <p className={`text-sm mt-1 ${style.messageColor}`}>
                {message}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
