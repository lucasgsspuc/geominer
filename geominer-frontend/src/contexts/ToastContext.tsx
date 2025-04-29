import { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor, SnackbarOrigin } from '@mui/material';

type Toast = {
  id: number;
  message: string;
  severity: AlertColor;
  duration?: number;
};

type ToastContextType = {
  showToast: (
    msg: string,
    options?: {
      severity?: AlertColor;
      duration?: number;
    }
  ) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export function ToastProvider({
  children,
  position = { vertical: 'top', horizontal: 'right' } as SnackbarOrigin,
}: {
  children: ReactNode;
  position?: SnackbarOrigin;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (
    message: string,
    options: { severity?: AlertColor; duration?: number } = {}
  ) => {
    const newToast: Toast = {
      id: ++toastId,
      message,
      severity: options.severity || 'info',
      duration: options.duration || 4000,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const handleClose = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open
          anchorOrigin={position}
          autoHideDuration={toast.duration}
          onClose={() => handleClose(toast.id)}
        >
          <Alert
            onClose={() => handleClose(toast.id)}
            severity={toast.severity}
            sx={{ width: '100%' }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast precisa estar dentro do ToastProvider');
  }
  return context;
}
