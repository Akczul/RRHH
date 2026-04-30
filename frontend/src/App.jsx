import { useEffect } from 'react';
import AppRouter from './router/AppRouter';
import { useAuthStore } from './stores/useAuthStore';
import { useThemeStore } from './stores/useThemeStore';

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
    checkAuth();
  }, [checkAuth, initTheme]);

  return <AppRouter />;
};

export default App;
