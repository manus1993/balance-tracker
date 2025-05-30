import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import useSettings from '../../Hooks/useSettings';

const options = ['AGUILA 3', 'CANARIO 3', 'PN53', 'CANARIO-53', 'CANARIO-52', 'CANARIO-51', 'AGUILA-72', 'AGUILA-81'];

export default function UserForm() {
  const { setToken, setAccount, setUserFilter, setReload } = useSettings();
  const { account } = useSettings();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' }, // column on mobile, row on larger screens
        gap: 2,
        border: '0.5px solid',
        boxShadow: 3,
        padding: 2,
        borderRadius: 3,
        maxWidth: '100%',
        margin: 'auto',
      }}
    >
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
        value={account}
        options={options}
        sx={{ flex: 1 }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        renderInput={(params) => <TextField {...params} label="Group" />}
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
