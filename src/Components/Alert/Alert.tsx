import { Alert as MuiAlert, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface ErrorDetails {
  message?: string;
  statusCode?: number;
  error?: Error | { message: string } | unknown;
}

interface AlertProps {
  alert: boolean;
  errorDetails?: ErrorDetails;
  onClose?: () => void;
}

function getErrorMessage(errorDetails?: ErrorDetails): string {
  if (!errorDetails) {
    return 'An unexpected error occurred. Please try again.';
  }

  const { statusCode, message, error } = errorDetails;

  // Handle specific status codes with contextual messages
  switch (statusCode) {
    case 401:
      return 'Authentication failed. Please check your login credentials and try again.';
    case 403:
      return 'Access denied. Please check your token and ensure you have proper permissions.';
    case 404:
      return 'The requested resource was not found. Please verify the URL or contact support.';
    case 429:
      return 'Too many requests. Please wait a moment before trying again.';
    case 500:
      return 'Server error occurred. Please try again later or contact support if the problem persists.';
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable. Please try again in a few minutes.';
    default:
      // Use custom message if provided, otherwise fallback to generic message
      if (message) {
        return message;
      }
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
        return error.message;
      }
      if (statusCode) {
        return `Request failed with status ${statusCode}. Please try again.`;
      }
      return 'An unexpected error occurred. Please try again.';
  }
}

function Alert({ alert, errorDetails, onClose }: AlertProps) {
  if (!alert) return null;

  const errorMessage = getErrorMessage(errorDetails);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 9999,
        maxWidth: 400,
        minWidth: 300,
      }}
    >
      <MuiAlert
        severity="error"
        action={
          onClose && (
            <IconButton aria-label="close" color="inherit" size="small" onClick={onClose}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          )
        }
        sx={{
          boxShadow: 3,
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
      >
        {errorMessage}
      </MuiAlert>
    </Box>
  );
}

Alert.defaultProps = {
  errorDetails: undefined,
  onClose: undefined,
};

export default Alert;
