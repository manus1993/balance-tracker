import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Grid, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import { useEffect } from 'react';
import useSettings from '../../Hooks/useSettings';
import { createNewBatch, createNewTransaction, downloadReceipts, downloadReport, ItemDetail } from '../Clients/Clients';

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

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const years = ['2024', '2025', '2026', '2027', '2028', '2029', '2030'];

const categoriesIncome = ['MONTHLY_INCOME', 'EXTRAORDINARY_INCOME'];
const categoriesExpenses = [
  'CFE',
  'ELEVADOR MANTENIMIENTO',
  'Gastos Administrativos',
  'Gastos Mensuales',
  'Limpieza',
  'Protección Civil',
  'Jardinería',
  'Vigilancia',
];

export function ButtonDesign({ modal_type, handleOpen }: { modal_type: string; handleOpen: () => void }) {
  const buttonProps = {
    onClick: handleOpen,
    variant: 'contained' as const,
  };

  let buttonConfig = {
    color: undefined as 'success' | 'warning' | 'primary' | undefined,
    label: '',
  };

  switch (modal_type) {
    case 'income':
      buttonConfig = { color: 'success', label: 'New Income' };
      break;
    case 'debt':
      buttonConfig = { color: 'primary', label: 'New Receipts Batch' };
      break;
    case 'get_receipt':
      buttonConfig = { color: 'primary', label: 'Get Receipt' };
      break;
    default:
      buttonConfig = { color: 'warning', label: 'New Expense' };
      break;
  }

  return (
    <Button onClick={buttonProps.onClick} variant={buttonProps.variant} color={buttonConfig.color}>
      {buttonConfig.label}
    </Button>
  );
}

export function UserIDSelector({ setUserID }: { setUserID: (userID: string) => void }) {
  return (
    <TextField
      id="userID"
      variant="outlined"
      label="User ID"
      placeholder="DEPTO ..."
      sx={{ flex: 1 }}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setUserID(event.target.value);
      }}
    />
  );
}

export function NameSelector({
  name,
  setName,
  enabled = true,
}: {
  name: string;
  setName: (name: string) => void;
  // eslint-disable-next-line react/require-default-props
  enabled?: boolean;
}) {
  useEffect(() => {
    if (!enabled && name !== '') {
      setName('');
    }
  }, [enabled, name, setName]);

  return (
    <TextField
      id="name"
      value={name}
      disabled={!enabled}
      variant="outlined"
      label="Name"
      sx={{ flex: 1 }}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
      }}
    />
  );
}

export function MonthYearSelector({
  month,
  setMonth,
  year,
  setYear,
}: {
  month: string;
  setMonth: (month: string) => void;
  year: string;
  setYear: (year: string) => void;
}) {
  return (
    <>
      <Autocomplete
        disablePortal
        id="month"
        options={months}
        value={month} // Set the value prop
        sx={{ flex: 1 }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        renderInput={(params) => <TextField {...params} label="Month" />}
        onChange={(event, value) => value && setMonth(value)}
      />
      <Autocomplete
        disablePortal
        id="year"
        options={years}
        value={year} // Set the value prop
        sx={{ flex: 1 }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        renderInput={(params) => <TextField {...params} label="Year" />}
        onChange={(event, value) => value && setYear(value)}
      />
    </>
  );
}

export function AmountSelector({ amount, setAmount }: { amount: string; setAmount: (amount: string) => void }) {
  return (
    <TextField
      id="amount"
      value={amount}
      variant="outlined"
      label="Amount"
      sx={{ flex: 1 }}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value);
      }}
    />
  );
}

export function CommentsSelector({
  comments,
  setComments,
}: {
  comments: string;
  setComments: (comments: string) => void;
}) {
  return (
    <TextField
      id="comments"
      variant="outlined"
      value={comments}
      label="Comments"
      size="medium"
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setComments(event.target.value);
      }}
    />
  );
}

export function CategorySelector({
  category,
  setCategory,
  movementType,
}: {
  category: string;
  setCategory: (category: string) => void;
  movementType: string;
}) {
  const categories = movementType === 'income' ? categoriesIncome : categoriesExpenses;
  return (
    <Autocomplete
      disablePortal
      id="category"
      value={category}
      options={categories}
      sx={{ flex: 1 }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      renderInput={(params) => <TextField {...params} label="Category" />}
      onChange={(event, value) => {
        setCategory(value ?? '');
      }}
    />
  );
}

export function NewReceiptBatchModal({ handleClose }: { handleClose: () => void }) {
  const [submit, setSubmit] = React.useState(false);
  const { token, account, setReload } = useSettings();
  const [month, setMonth] = React.useState('');
  const [year, setYear] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [comments, setComments] = React.useState('');
  const [category, setCategory] = React.useState('');

  React.useEffect(() => {
    if (submit) {
      createNewBatch(token, account, month, year, amount, comments, category);
      setSubmit(false);
      setReload(true);
      handleClose();
    }
  }, [submit, token, account, month, year, amount, comments, category, setReload, handleClose]);

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
      <Typography variant="h6">New Receipt Batch</Typography>
      <MonthYearSelector month={month} setMonth={setMonth} year={year} setYear={setYear} />
      <AmountSelector amount={amount} setAmount={setAmount} />
      <CommentsSelector comments={comments} setComments={setComments} />
      <CategorySelector category={category} setCategory={setCategory} movementType="income" />
      <Button variant="contained" onClick={() => setSubmit(true)}>
        Submit
      </Button>
    </Box>
  );
}

export function NewIncomeModal({ handleClose }: { handleClose: () => void }) {
  const [submit, setSubmit] = React.useState(false);
  const { token, account, setReload } = useSettings();
  const [month, setMonth] = React.useState('');
  const [year, setYear] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [comments, setComments] = React.useState('');
  const [userID, setUserID] = React.useState('');
  const [nameDetail, setNameDetail] = React.useState('');
  const [enableName, setEnableName] = React.useState(false);
  const category = 'MONTHLY_INCOME';

  React.useEffect(() => {
    if (submit) {
      const user = userID;
      createNewTransaction(token, account, month, year, amount, comments, category, user, nameDetail, 'income');
      setReload(true);
      handleClose();
      setSubmit(false);
    }
  }, [submit, token, account, month, year, amount, comments, category, userID, setReload, handleClose, nameDetail]);

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
      <Typography variant="h6">New Income</Typography>
      <UserIDSelector setUserID={setUserID} />
      <MonthYearSelector month={month} setMonth={setMonth} year={year} setYear={setYear} />
      <AmountSelector amount={amount} setAmount={setAmount} />
      <CommentsSelector comments={comments} setComments={setComments} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Checkbox
          checked={enableName}
          onChange={(event) => setEnableName(event.target.checked)}
          inputProps={{ 'aria-label': 'Enable name input' }}
        />
        <Typography variant="body2" color="warning.main">
          Enable name field (Warning: only if necessary)
        </Typography>
      </Box>

      <NameSelector name={nameDetail} setName={setNameDetail} enabled={enableName} />
      <Button variant="contained" onClick={() => setSubmit(true)}>
        Submit
      </Button>
    </Box>
  );
}

export function NewExpenseModal({ handleClose }: { handleClose: () => void }) {
  const [submit, setSubmit] = React.useState(false);
  const { token, account, setReload } = useSettings();
  const [month, setMonth] = React.useState('');
  const [year, setYear] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [comments, setComments] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [nameDetail, setNameDetail] = React.useState('');

  React.useEffect(() => {
    if (submit) {
      const user = 'DEPTO 0';
      const name = nameDetail;
      const movementType = 'expense';
      createNewTransaction(token, account, month, year, amount, comments, category, user, name, movementType);
      setReload(true);
      setSubmit(false);
      handleClose();
    }
  }, [submit, token, account, month, year, amount, comments, category, nameDetail, setReload, handleClose]);
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
      <Typography variant="h6">New Expense</Typography>
      <NameSelector name={nameDetail} setName={setNameDetail} />
      <MonthYearSelector month={month} setMonth={setMonth} year={year} setYear={setYear} />
      <AmountSelector amount={amount} setAmount={setAmount} />
      <CommentsSelector comments={comments} setComments={setComments} />
      <CategorySelector category={category} setCategory={setCategory} movementType="expense" />
      <Button variant="contained" onClick={() => setSubmit(true)}>
        Submit
      </Button>
    </Box>
  );
}

export function GetReceiptsModal({ handleClose }: { handleClose: () => void }) {
  const [submit, setSubmit] = React.useState(false);
  const { token, account } = useSettings();
  const [initial, setInitial] = React.useState(0);
  const [final, setFinal] = React.useState(0);

  React.useEffect(() => {
    if (submit) {
      console.log('Get receipts from', initial, 'to', final);
      downloadReceipts(token, account, initial, final);
      setSubmit(false);
      handleClose();
    }
  }, [submit, token, account, initial, final, handleClose]);
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
      <Typography variant="h6">Get Receipts</Typography>
      <TextField
        id="initial"
        variant="outlined"
        label="Initial"
        sx={{ flex: 1 }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setInitial(Number(event.target.value));
        }}
      />
      <TextField
        id="final"
        variant="outlined"
        label="Final"
        sx={{ flex: 1 }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setFinal(Number(event.target.value));
        }}
      />
      <Button variant="contained" onClick={() => setSubmit(true)}>
        Submit
      </Button>
    </Box>
  );
}

export function GetReportModal({ handleClose }: { handleClose: () => void }) {
  const [submit, setSubmit] = React.useState(false);
  const { token, account } = useSettings();
  const [month, setMonth] = React.useState('');
  const [year, setYear] = React.useState('');

  React.useEffect(() => {
    if (submit) {
      console.log('Get report for', month, year);
      downloadReport(token, account, month, year);
      setSubmit(false);
      handleClose();
    }
  }, [submit, token, account, month, year, handleClose]);
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
      <Typography variant="h6">Get Report</Typography>
      <MonthYearSelector month={month} setMonth={setMonth} year={year} setYear={setYear} />
      <Button variant="contained" onClick={() => setSubmit(true)}>
        Submit
      </Button>
    </Box>
  );
}

type ModalType = 'income' | 'debt' | 'expenses';

export default function BasicModal({ modal_type }: { modal_type: ModalType }) {
  const [open, setOpen] = React.useState(false);
  const [openCustom, setOpenCustom] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenCustom = () => setOpenCustom(true);
  const handleCloseCustom = () => setOpenCustom(false);

  const ModalSwitch = {
    income: <NewIncomeModal handleClose={handleClose} />,
    debt: <NewReceiptBatchModal handleClose={handleClose} />,
    expenses: <NewExpenseModal handleClose={handleClose} />,
  };
  const modal = ModalSwitch[modal_type];

  const customModal = <GetReceiptsModal handleClose={handleCloseCustom} />;

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <ButtonDesign modal_type={modal_type} handleOpen={handleOpen} />
        {modal_type === 'income' && <ButtonDesign modal_type="get_receipt" handleOpen={handleOpenCustom} />}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{modal}</Box>
      </Modal>
      {modal_type === 'income' && (
        <Modal
          open={openCustom}
          onClose={handleCloseCustom}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>{customModal}</Box>
        </Modal>
      )}
    </div>
  );
}
