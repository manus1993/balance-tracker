import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import PaymentIcon from '@mui/icons-material/Payment';
import { marksAsPaid } from '../Clients/Clients';
import useSettings from '../../Hooks/useSettings';

interface Row {
  id: string;
  transaction_id: number;
  user: string;
  name: string;
  amount: number;
}

export default function MovementsTab({ rows, actions = false }: { rows: Row[]; actions: boolean }) {
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
    columns.push({
      field: 'actions',
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          key={`action-${params.row.id}`} // Add a unique key prop
          label="Pagado"
          icon={<PaymentIcon />}
          onClick={() => marksAsPaid(token, account, params.row, setReload)}
        />,
      ],
    });
  }

  return (
    <Box sx={{ height: 380, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
