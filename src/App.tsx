import { GeoLocationProvider } from './context/GeoLocationContext';
import './App.css'
import AppContent from './AppContent';

const App = () => {
  return (
    <GeoLocationProvider>
      <AppContent />
    </GeoLocationProvider>
  )
}

export default App
