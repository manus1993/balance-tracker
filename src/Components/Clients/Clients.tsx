import axios from 'axios';
import formatAsCurrency from '../utils/utils';
import useSettings from '../../Hooks/useSettings';

const url = 'http://ec2-3-140-252-95.us-east-2.compute.amazonaws.com:8001/v1/';
interface ItemDetail {
  user: string;
  name: string;
  transaction_id: number;
  amount: number;
  comments: string;
}

interface DebtItems {
  debt_detail: ItemDetail[];
}
interface IncomeItems {
  income_source: ItemDetail[];
}

interface ExpenseItems {
  expense_detail: ItemDetail[];
}

export function parseUsers(users: string[]) {
  const cleanedList = users.map((item) => item.replace('DEPTO', '').trim());
  return cleanedList.join(', ');
}

const useFetchData = ({ setAlert }: { setAlert: (alert: boolean) => void }) => {
  const { token, account, userFilter, setIncome, setExpenses, setDebt, setGroupDetails } = useSettings();
  const fetchData = async () => {
    const FetchUrl = `${url}transactions/parsed-data?group_id=${account}${userFilter ? `&user_id=${userFilter}` : ''}`;
    axios
      .get(FetchUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDebt(
          response.data.parsed_data.debt.flatMap((item: DebtItems) =>
            item.debt_detail.map((detail: ItemDetail) => ({
              id: `${detail.user}-${detail.name}`, // or some other unique identifier
              transaction_id: detail.transaction_id,
              name: detail.name,
              amount: detail.amount,
              user: detail.user,
              comments: detail.comments,
            })),
          ),
        );
        setIncome(
          response.data.parsed_data.income.flatMap((item: IncomeItems) =>
            item.income_source.map((detail: ItemDetail, index: number) => ({
              id: `${index}-${detail.user}-${detail.name}`,
              transaction_id: detail.transaction_id, // or some other unique identifier
              name: detail.name,
              amount: detail.amount,
              user: detail.user,
              comments: detail.comments,
            })),
          ),
        );

        setExpenses(
          response.data.parsed_data.expense.flatMap((item: ExpenseItems) =>
            item.expense_detail.map((detail: ItemDetail, index: number) => ({
              id: `${index}-${detail.user}-${detail.name}`,
              transaction_id: detail.transaction_id, // or some other unique identifier
              name: detail.name,
              amount: detail.amount,
              user: detail.user,
              comments: detail.comments,
            })),
          ),
        );
        setGroupDetails([
          { concept: 'Total Income', detail: formatAsCurrency(response.data.group_details.total_income) },
          { concept: 'Expenses', detail: formatAsCurrency(response.data.group_details.total_expense) },
          { concept: 'Balance', detail: formatAsCurrency(response.data.group_details.balance) },
          { concept: 'Pending', detail: formatAsCurrency(response.data.group_details.total_debt) },
          { concept: 'Total Available', detail: formatAsCurrency(response.data.group_details.total_available) },
          { concept: 'Users With Debt', detail: parseUsers(response.data.group_details.users_with_debt) },
        ]);
      })
      .catch((error) => {
        console.error('There was an error!', error);
        setAlert(true);
      });
  };
  return fetchData;
};

const monthsMapping: { [key: string]: string } = {
  January: '1',
  February: '2',
  March: '3',
  April: '4',
  May: '5',
  June: '6',
  July: '7',
  August: '8',
  September: '9',
  October: '10',
  November: '11',
  December: '12',
};

export default useFetchData;

export function marksAsPaid(
  token: string,
  account: string | null,
  row: ItemDetail,
  setReload: (reload: boolean) => void,
) {
  const SubmitUrl = `${url}transactions/mark-receipt-as-paid`;
  axios
    .post(
      SubmitUrl,
      {
        group_id: account,
        user_id: row.user,
        name: row.name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then(() => {
      console.log('Transaction updated');
      setReload(true);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('There was an error!', error);
    });
}

export function createNewBatch(
  token: string,
  account: string | null,
  month: string,
  year: string,
  amount: string,
  comments: string,
  category: string,
) {
  const SubmitUrl = `${url}transactions/create-receipt-batch`;
  axios
    .post(
      SubmitUrl,
      {
        group_id: account,
        month: monthsMapping[month],
        year,
        amount,
        category,
        comments,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then(() => {
      console.log('Receipt batch created');
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('There was an error!', error);
    });
}

export function createNewTransaction(
  token: string,
  account: string | null,
  month: string,
  year: string,
  amount: string,
  comments: string,
  category: string,
  user: string,
  name: string,
  movement_type: string,
) {
  const SubmitUrl = `${url}transactions/create-new-transaction`;
  axios
    .post(
      SubmitUrl,
      {
        group_id: account,
        user_id: user,
        month: monthsMapping[month],
        year,
        amount,
        category,
        comments,
        name,
        movement_type,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then(() => {
      console.log('Transaction created');
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('There was an error!', error);
    });
}
