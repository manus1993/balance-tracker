import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import UserForm from '../UserForm/UserForm';
import Tabs from '../Tabs/Tabs';
import SearchAppBar from '../TopBar/TopBar';
import useFetchData from '../Clients/Clients';
import useSettings from '../../Hooks/useSettings';
import Alert from '../Alert/Alert';

export default function MainApp() {
  const [alert, setAlert] = useState(false);
  const fetchData = useFetchData({ setAlert });
  const { reload, setReload } = useSettings();

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    }
    if (reload) {
      fetchData();
    }
    setReload(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, alert]);

  return (
    <>
      <header className="App-header">
        <SearchAppBar />
      </header>
      <div className="App-body">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
          <Container>
            <h3>User</h3>
            <UserForm />
          </Container>
          <Container>
            <Tabs />
            <Alert alert={alert} />
          </Container>
        </Box>
      </div>
    </>
  );
}
