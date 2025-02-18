import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import PaymentIcon from '@mui/icons-material/Payment';
import DownloadIcon from '@mui/icons-material/Download';
import { marksAsPaid, downloadReceipt } from '../Clients/Clients';
import useSettings from '../../Hooks/useSettings';

interface Row {
  id: string;
  transaction_id: number;
  user: string;
  name: string;
  amount: number;
}

export default function MovementsTab({ type, rows, actions = false }: { type: string; rows: Row[]; actions: boolean }) {
  const { token, account, setReload } = useSettings();
  const columns: GridColDef[] = [
    { field: 'transaction_id', headerName: '# Receipt', width: 90 },
    {
      field: 'user',
      headerName: 'User',
      width: 150,
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
            label="Pagado"
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
          <GridActionsCellItem
            key={`action-${params.row.id}`}
            label="Download"
            icon={<DownloadIcon />}
            onClick={() => downloadReceipt(token, account, params.row)}
          />,
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
    </Box>
  );
}
