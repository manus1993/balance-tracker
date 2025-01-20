import SettingsProvider from './Providers/SettingsProvider';
import MainApp from './Components/MainApp/MainApp';

import './App.css';

function App() {
  return (
    <SettingsProvider>
      <MainApp />
    </SettingsProvider>
  );
}

export default App;
