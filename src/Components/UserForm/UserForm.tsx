import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

const options = ['AGUILA 3', 'CANARIO 3', 'PASEO NUEVO 53'];

export default function UserForm({
  setToken,
  setAccount,
  setUserFilter,
  setReload,
}: {
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
  setUserFilter: React.Dispatch<React.SetStateAction<string>>;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
