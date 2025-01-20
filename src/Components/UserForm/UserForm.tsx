import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import useSettings from '../../Hooks/useSettings';

const options = ['AGUILA 3', 'CANARIO 3', 'PN53', 'TEST-GROUP'];

export default function UserForm() {
  const { setToken, setAccount, setUserFilter, setReload } = useSettings();

  return (
    <Box sx={{ display: 'flex', gap: 2, border: '0.5px solid', boxShadow: 3, padding: 2, borderRadius: 3 }}>
      <TextField
        id="token"
        type="password"
        defaultValue="Small"
        variant="outlined"
        label="Token"
        sx={{ flex: 1 }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setToken(event.target.value);
        }}
      />
      <Autocomplete
        disablePortal
        options={options}
        sx={{ flex: 1 }}
        // react/jsx-props-no-spreading
        // eslint-disable-next-line react/jsx-props-no-spreading
        renderInput={(params) => <TextField {...params} label="User Filter" />}
        onChange={(event, value) => setAccount(value)}
      />
      <TextField
        id="table-filter"
        variant="outlined"
        label="User Filter"
        sx={{ flex: 1 }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setUserFilter(event.target.value);
        }}
      />
      <Button variant="contained" onClick={() => setReload(true)}>
        Go
      </Button>
    </Box>
  );
}
