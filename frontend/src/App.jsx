import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider }  from './context/AuthContext';
import AppRouter         from './router/AppRouter';

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </ThemeProvider>
);

export default App;
