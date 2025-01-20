import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import UserForm from '../UserForm/UserForm';
import Tabs from '../Tabs/Tabs';
import SearchAppBar from '../TopBar/TopBar';
import useFetchData from '../Clients/Clients';
import useSettings from '../../Hooks/useSettings';

export default function MainApp() {
  const fetchData = useFetchData();
  const { reload, setReload } = useSettings();

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
            <h3>User</h3>
            <UserForm />
          </Container>
          <Container>
            <Tabs />
          </Container>
        </Box>
      </div>
    </>
  );
}
