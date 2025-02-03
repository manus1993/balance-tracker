import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import useSettings from '../../Hooks/useSettings';
import { createNewBatch, createNewTransaction } from '../Clients/Clients';

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

export function ButtonDesign({ modal_type, handle_open }: { modal_type: string; handle_open: () => void }) {
  const buttonProps = {
    onClick: handle_open,
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

const categories = ['MONTLY_INCOME', 'EXTRAORDINARY_INCOME'];

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

export function NameSelector({ setName }: { setName: (name: string) => void }) {
  return (
    <TextField
      id="name"
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

export function AmountSelector({ setAmount }: { setAmount: (amount: string) => void }) {
  return (
    <TextField
      id="amount"
      variant="outlined"
      label="Amount"
      sx={{ flex: 1 }}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value);
      }}
    />
  );
}

export function CommentsSelector({ setComments }: { setComments: (comments: string) => void }) {
  return (
    <TextField
      id="comments"
      variant="outlined"
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
  selectorOnly,
}: {
  category: string;
  setCategory: (category: string) => void;
  selectorOnly: boolean;
}) {
  if (selectorOnly) {
    return (
      <Autocomplete
        disablePortal
        id="category"
        value={category}
        options={categories}
        sx={{ flex: 1 }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        renderInput={(params) => <TextField {...params} label="Category" />}
        onChange={(event, value) => value && setCategory(value)}
      />
    );
  }
  return (
    <TextField
      id="category"
      variant="outlined"
      label="Category"
      sx={{ flex: 1 }}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setCategory(event.target.value);
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
      <AmountSelector setAmount={setAmount} />
      <CommentsSelector setComments={setComments} />
      <CategorySelector category={category} setCategory={setCategory} selectorOnly />
      <Button variant="contained" onClick={() => setSubmit(true)}>
        Submit
      </Button>
    </Box>
  );
}

export function NewIncomeModa({ handleClose }: { handleClose: () => void }) {
  const [submit, setSubmit] = React.useState(false);
  const { token, account, setReload } = useSettings();
  const [month, setMonth] = React.useState('');
  const [year, setYear] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [comments, setComments] = React.useState('');
  const [userID, setUserID] = React.useState('');
  const category = 'MONTLY_INCOME';

  React.useEffect(() => {
    if (submit) {
      const user = userID;
      createNewTransaction(token, account, month, year, amount, comments, category, user, '', 'income');
      setReload(true);
      handleClose();
      setSubmit(false);
    }
  }, [submit, token, account, month, year, amount, comments, category, userID, setReload, handleClose]);

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
      <AmountSelector setAmount={setAmount} />
      <CommentsSelector setComments={setComments} />
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
      <NameSelector setName={setNameDetail} />
      <MonthYearSelector month={month} setMonth={setMonth} year={year} setYear={setYear} />
      <AmountSelector setAmount={setAmount} />
      <CommentsSelector setComments={setComments} />
      <CategorySelector category={category} setCategory={setCategory} selectorOnly={false} />
      <Button variant="contained" onClick={() => setSubmit(true)}>
        Submit
      </Button>
    </Box>
  );
}

type ModalType = 'income' | 'debt' | 'expenses';

export default function BasicModal({ modal_type }: { modal_type: ModalType }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const ModalSwitch = {
    income: <NewIncomeModa handleClose={handleClose} />,
    debt: <NewReceiptBatchModal handleClose={handleClose} />,
    expenses: <NewExpenseModal handleClose={handleClose} />,
  };
  const modal = ModalSwitch[modal_type];

  return (
    <div>
      <ButtonDesign modal_type={modal_type} handle_open={handleOpen} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{modal}</Box>
      </Modal>
    </div>
  );
}
