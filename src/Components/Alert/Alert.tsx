import { Alert as MuiAlert, Stack } from '@mui/material';

export default function Alert({ alert }: { alert: boolean }) {
  return (
    alert && (
      <Stack sx={{ width: '100%' }} spacing={2}>
        <MuiAlert severity="error">This is an error alert — check it out!</MuiAlert>
      </Stack>
    )
  );
}
