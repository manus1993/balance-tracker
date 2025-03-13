import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import PaymentIcon from '@mui/icons-material/Payment';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import { Button, Typography } from '@mui/material';
import { marksAsPaid, downloadReceipts, deleteTransaction, editTransaction } from '../Clients/Clients';
import useSettings from '../../Hooks/useSettings';
import { AmountSelector, CategorySelector, CommentsSelector, NameSelector } from './Modal';

interface Row {
  id: string;
  transaction_id: number;
  user: string;
  name: string;
  amount: number;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export function EditTransactionModal({
  handleClose,
  row,
  movementType,
}: {
  handleClose: () => void;
  row: ItemDetail;
  movementType: string;
}) {
  const [submit, setSubmit] = React.useState(false);
  const { token, account, setReload } = useSettings();
  const [amount, setAmount] = React.useState('');
  const [comments, setComments] = React.useState('');
  const [category, setCategory] = React.useState<string | null>(null);
  const [nameDetail, setNameDetail] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (submit) {
      editTransaction(token, account, row, amount, category, comments, nameDetail, setReload);
      setSubmit(false);
      handleClose();
    }
  }, [submit, token, account, handleClose, row, amount, category, comments, nameDetail, setReload]);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        border: '0.5px solid',
        boxShadow: 3,
        padding: 2,
        borderRadius: 3,
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6">Edit Transaction</Typography>
      {movementType !== 'income' ? (
        <>
          <NameSelector setName={setNameDetail} />
          <CategorySelector category={category || ''} setCategory={setCategory} selectorOnly={false} />
        </>
      ) : null}
      <AmountSelector setAmount={setAmount} />
      <CommentsSelector setComments={setComments} />
      <Button variant="contained" onClick={() => setSubmit(true)}>
        Submit
      </Button>
    </Box>
  );
}

export default function MovementsTab({ type, rows, actions = false }: { type: string; rows: Row[]; actions: boolean }) {
  const { token, account, setReload } = useSettings();
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<ItemDetail | null>(null);
  const [movementType, setMovementType] = React.useState('');

  const handleEditButton = (row: ItemDetail, value: string) => {
    setSelectedRow(row);
    setMovementType(value);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const columns: GridColDef[] = [
    { field: 'transaction_id', headerName: '# Receipt', width: 60 },
    {
      field: 'user',
      headerName: 'User',
      width: 110,
      editable: false,
    },
    {
      field: 'name',
      headerName: 'Description',
      width: 180,
      editable: false,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      type: 'number',
      width: 110,
      editable: false,
    },
    {
      field: 'comments',
      headerName: 'Comments',
      width: 500,
      editable: false,
    },
  ];

  if (actions) {
    if (type === 'debt') {
      columns.push({
        field: 'actions',
        type: 'actions',
        getActions: (params) => [
          <GridActionsCellItem
            key={`action-${params.row.id}`} // Add a unique key prop
            label="Pay"
            icon={<PaymentIcon />}
            onClick={() => marksAsPaid(token, account, params.row, setReload)} // Correct function name
          />,
        ],
      });
    } else if (type === 'income') {
      columns.push({
        field: 'actions',
        type: 'actions',
        getActions: (params) => [
          <>
            <GridActionsCellItem
              key={`action-${params.row.id}-download`}
              label="Download"
              icon={<DownloadIcon />}
              onClick={() => downloadReceipts(token, account, params.row.transaction_id, params.row.transaction_id)}
            />
            <GridActionsCellItem
              key={`action-${params.row.id}-edit`}
              label="Edit"
              icon={<EditIcon />}
              onClick={() => handleEditButton(params.row, 'income')}
            />
            <GridActionsCellItem
              key={`action-${params.row.id}-delete`}
              label="Delete"
              icon={<DeleteIcon />}
              onClick={() => deleteTransaction(token, account, params.row, setReload)}
            />
          </>,
        ],
      });
    } else if (type === 'expense') {
      columns.push({
        field: 'actions',
        type: 'actions',
        getActions: (params) => [
          <>
            <GridActionsCellItem
              key={`action-${params.row.id}-edit`}
              label="Edit"
              icon={<EditIcon />}
              onClick={() => handleEditButton(params.row, 'expense')}
            />
            <GridActionsCellItem
              key={`action-${params.row.id}-delete`}
              label="Delete"
              icon={<DeleteIcon />}
              onClick={() => deleteTransaction(token, account, params.row, setReload)}
            />
          </>,
        ],
      });
    }
  }

  return (
    <Box sx={{ height: 450, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 6,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {selectedRow && (
            <EditTransactionModal handleClose={handleClose} row={selectedRow} movementType={movementType} />
          )}
        </Box>
      </Modal>
    </Box>
  );
}
