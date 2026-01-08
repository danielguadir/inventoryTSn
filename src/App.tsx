import { useSelector } from 'react-redux';
import { LoginPage } from './modules/Auth/LoginPage';
import { MainLayout } from './modules/Layout/MainLayout';
import type { RootState } from './api/store/store';

const App = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <>
      {token ? (
        <MainLayout />
      ) : (
        <LoginPage />
      )}
    </>
  );
}

export default App