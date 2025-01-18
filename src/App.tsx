import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import SearchAppBar from './Components/TopBar/TopBar';
import UserForm from './Components/UserForm/UserForm';
import Tabs from './Components/Tabs/Tabs';
import FetchData from './Components/Clients/Clients';

import './App.css';

function App() {
  const [token, setToken] = useState('');
  const [account, setAccount] = useState('' as string | null);
  const [userFilter, setUserFilter] = useState('');
  const [reload, setReload] = useState(false);
  const [income, setIncome] = useState<ItemDetail[]>([]);
  const [debt, setDebt] = useState<ItemDetail[]>([]);
  const [expenses, setExpenses] = useState<ItemDetail[]>([]);
  const [groupDetails, setGroupDetails] = useState<{ concept: string; detail: string }[]>([]);

  useEffect(() => {
    if (reload) {
      FetchData({ token, account, userFilter, setIncome, setDebt, setExpenses, setGroupDetails });
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
            <UserForm setToken={setToken} setAccount={setAccount} setUserFilter={setUserFilter} setReload={setReload} />
          </Container>
          <Container>
            <Tabs
              token={token}
              account={account}
              income={income}
              expenses={expenses}
              debt={debt}
              groupDetails={groupDetails}
              setReload={setReload}
            />
          </Container>
        </Box>
      </div>
    </>
  );
}

export default App;
