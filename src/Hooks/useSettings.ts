import { useContext } from 'react';
import settingsContext from '../Contexts/settingsContext';

const useSettings = () => {
  const context = useContext(settingsContext);

  if (context === undefined) {
    throw new Error('useSettings must be used within SettingsProvider');
  }

  return context;
};

export default useSettings;
