'use client';

import { Provider } from 'react-redux';
import { MotionConfig } from 'framer-motion';
import { store } from '@/lib/store';
import ToastProvider from '@/components/Toast';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <MotionConfig reducedMotion="user">
          <ToastProvider>{children}</ToastProvider>
        </MotionConfig>
      </Provider>
    </ThemeProvider>
  );
}
