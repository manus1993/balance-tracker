import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Chip,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { SetIncidentModal } from './Modal';
import { getIncidents, deleteIncident, IncidentData, IncidentType, IncidentStatus } from '../Clients/incidentClient';
import useSettings from '../../Hooks/useSettings';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '80vh',
  overflow: 'auto',
};

// Helper function to get status color
const getStatusColor = (
  status: IncidentStatus,
): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status) {
    case IncidentStatus.REPORTED:
      return 'info';
    case IncidentStatus.IN_REVIEW:
      return 'warning';
    case IncidentStatus.ASSIGNED:
    case IncidentStatus.IN_PROGRESS:
      return 'primary';
    case IncidentStatus.WAITING_PARTS:
    case IncidentStatus.ON_HOLD:
      return 'secondary';
    case IncidentStatus.RESOLVED:
    case IncidentStatus.VERIFIED:
      return 'success';
    case IncidentStatus.CLOSED:
      return 'default';
    case IncidentStatus.CANCELLED:
      return 'error';
    default:
      return 'default';
  }
};

// Helper function to format incident type
const formatIncidentType = (type: IncidentType): string =>
  type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

interface IncidentDetailModalProps {
  incident: IncidentData;
  handleClose: () => void;
}

function IncidentDetailModal({ incident, handleClose }: IncidentDetailModalProps) {
  return (
    <Box>
      <Typography variant="h6" component="h2" gutterBottom>
        Incident Details
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          ID:
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {incident.incident_id}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Type:
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {formatIncidentType(incident.incident_type)}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Status:
        </Typography>
        <Chip
          label={incident.incident_status.replace(/_/g, ' ').toUpperCase()}
          color={getStatusColor(incident.incident_status)}
          size="small"
          sx={{ mb: 1 }}
        />

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Message:
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {incident.message}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Submitter:
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {incident.submitter}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Created:
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {new Date(incident.created_at).toLocaleString()}
        </Typography>

        {incident.solved_by && (
          <>
            <Typography variant="body2" color="text.secondary">
              Solved by:
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {incident.solved_by}
            </Typography>
          </>
        )}
      </Box>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleClose} variant="contained">
          Close
        </Button>
      </Box>
    </Box>
  );
}

export default function IncidentTab() {
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<IncidentData | null>(null);
  const [incidents, setIncidents] = useState<IncidentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token, account, setReload, reload } = useSettings();

  // Load incidents on component mount and when reload changes
  useEffect(() => {
    const loadIncidents = async () => {
      if (!token || !account) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const incidentsData = await getIncidents(token, account);
        setIncidents(incidentsData);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load incidents';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadIncidents();
  }, [token, account, reload]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleViewDetails = (incident: IncidentData) => {
    setSelectedIncident(incident);
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setSelectedIncident(null);
  };

  // Deletion flow state and handlers
  const [incidentToDelete, setIncidentToDelete] = useState<IncidentData | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleRequestDelete = (incident: IncidentData) => {
    setIncidentToDelete(incident);
    setDeleteError(null);
  };

  const handleCancelDelete = () => {
    setIncidentToDelete(null);
    setDeleteError(null);
    setDeleteLoading(false);
  };

  const handleConfirmDelete = async () => {
    if (!token || !account || !incidentToDelete) return;
    try {
      setDeleteLoading(true);
      await deleteIncident(token, account, incidentToDelete.incident_id);
      setReload(!reload); // Trigger reload
      handleCancelDelete();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete incident';
      setDeleteError(message);
      setDeleteLoading(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'incident_id',
      headerName: 'ID',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {params.value.substring(0, 8)}...
        </Typography>
      ),
    },
    {
      field: 'incident_type',
      headerName: 'Type',
      width: 150,
      renderCell: (params) => formatIncidentType(params.value),
    },
    {
      field: 'incident_status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value.replace(/_/g, ' ').toUpperCase()} color={getStatusColor(params.value)} size="small" />
      ),
    },
    {
      field: 'submitter',
      headerName: 'Submitter',
      width: 120,
    },
    {
      field: 'message',
      headerName: 'Message',
      width: 300,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 160,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          key={`view-${params.row.incident_id}`}
          label="View Details"
          icon={<VisibilityIcon />}
          onClick={() => handleViewDetails(params.row)}
        />,
        <GridActionsCellItem
          key={`delete-${params.row.incident_id}`}
          label="Delete"
          icon={<DeleteIcon />}
          onClick={() => handleRequestDelete(params.row)}
        />,
      ],
    },
  ];

  const customModal = <SetIncidentModal handleClose={handleClose} />;

  if (!token || !account) {
    return <Alert severity="warning">Please configure your token and group to view incidents.</Alert>;
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Button onClick={handleOpen} variant="contained" color="primary">
          New Incident
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ height: 450, width: '100%' }}>
        <DataGrid
          rows={incidents}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.incident_id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 6,
              },
            },
          }}
          pageSizeOptions={[6, 12, 25]}
          disableRowSelectionOnClick
        />
      </Box>

      {deleteError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {deleteError}
        </Alert>
      )}

      {/* New Incident Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-slide"
        aria-describedby="modal-modal-slide-description"
      >
        <Box sx={style}>{customModal}</Box>
      </Modal>

      {/* Incident Detail Modal */}
      <Modal
        open={detailOpen}
        onClose={handleDetailClose}
        aria-labelledby="incident-detail-modal"
        aria-describedby="incident-detail-description"
      >
        <Box sx={style}>
          {selectedIncident && <IncidentDetailModal incident={selectedIncident} handleClose={handleDetailClose} />}
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(incidentToDelete)}
        onClose={handleCancelDelete}
        aria-labelledby="delete-incident-dialog-title"
      >
        <DialogTitle id="delete-incident-dialog-title">Delete Incident</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Are you sure you want to delete incident ${incidentToDelete?.incident_id}? This action cannot be undone.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={deleteLoading}>
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
