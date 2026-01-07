import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './api/store/store'
import './components/UXLib/styles/cmpStyles.scss'
// import './index.css'
import App from './App.tsx'

// Root component to satisfy fast-refresh requirements
const Root = () => (
  <StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={<div > cargando... </div>}
        persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
)

createRoot(document.getElementById('root')!).render(<Root />)

export default Root
