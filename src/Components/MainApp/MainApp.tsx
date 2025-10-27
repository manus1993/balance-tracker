import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import UserForm from '../UserForm/UserForm';
import Tabs from '../Tabs/Tabs';
import SearchAppBar from '../TopBar/TopBar';
import useFetchData from '../Clients/Clients';
import useSettings from '../../Hooks/useSettings';
import Alert, { ErrorDetails } from '../Alert/Alert';

export default function MainApp() {
  const [alert, setAlert] = useState(false);
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | undefined>(undefined);
  const fetchData = useFetchData({
    setAlert,
    setErrorDetails,
  });
  const { reload, setReload } = useSettings();

  const handleCloseAlert = () => {
    setAlert(false);
    setErrorDetails(undefined);
  };

  useEffect(() => {
    if (alert) {
      // Auto-dismiss after 5 seconds (increased from 3 for better UX)
      const timer = setTimeout(() => {
        handleCloseAlert();
      }, 5000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [alert]);

  useEffect(() => {
    if (reload) {
      fetchData();
    }
    setReload(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  return (
    <>
      <header className="App-header">
        <SearchAppBar />
      </header>
      <div className="App-body">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
          <Container>
            <h3>User Info</h3>
            <UserForm />
          </Container>
          <Container>
            <Tabs />
          </Container>
        </Box>
      </div>

      {/* Alert positioned at top-right, outside main content flow */}
      <Alert alert={alert} errorDetails={errorDetails} onClose={handleCloseAlert} />
    </>
  );
}
