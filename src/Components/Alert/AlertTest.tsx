import React, { useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import Alert, { ErrorDetails } from './Alert';

// Test component to demonstrate different error scenarios
export default function AlertTest() {
  const [alert, setAlert] = useState(false);
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | undefined>(undefined);

  const testScenarios = [
    {
      name: 'No Details',
      details: undefined,
    },
    {
      name: '403 Error',
      details: { statusCode: 403 },
    },
    {
      name: '404 Error',
      details: { statusCode: 404 },
    },
    {
      name: '500 Error',
      details: { statusCode: 500 },
    },
    {
      name: 'Custom Message',
      details: { message: 'Custom error message for testing' },
    },
    {
      name: 'Network Error',
      details: {
        error: { message: 'Network Error: Unable to connect to server' },
      },
    },
  ];

  const handleTestScenario = (details: ErrorDetails | undefined) => {
    setErrorDetails(details);
    setAlert(true);
  };

  const handleClose = () => {
    setAlert(false);
    setErrorDetails(undefined);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Alert Component Test
      </Typography>
      <Typography variant="body1" gutterBottom>
        Test different error scenarios to see how the alert displays:
      </Typography>

      <Stack spacing={2} sx={{ marginTop: 2, maxWidth: 300 }}>
        {testScenarios.map((scenario) => (
          <Button key={scenario.name} variant="outlined" onClick={() => handleTestScenario(scenario.details)}>
            Test {scenario.name}
          </Button>
        ))}
        <Button variant="contained" color="secondary" onClick={handleClose}>
          Close Alert
        </Button>
      </Stack>

      <Alert alert={alert} errorDetails={errorDetails} onClose={handleClose} />
    </div>
  );
}
