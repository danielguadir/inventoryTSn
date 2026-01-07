import { useState } from 'react';
import { LoginPage } from './modules/Auth/LoginPage';
import { MainLayout } from './modules/Layout/MainLayout';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {isLoggedIn ? (
        <MainLayout />
      ) : (
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      )}
    </>
  );
}

export default App