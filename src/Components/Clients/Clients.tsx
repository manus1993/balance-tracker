import axios from 'axios';
import formatAsCurrency from '../utils/utils';

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

export default function FetchData({
  token,
  account,
  userFilter,
  setIncome,
  setDebt,
  setExpenses,
  setGroupDetails,
}: {
  token: string;
  account: string | null;
  userFilter: string;
  setIncome: React.Dispatch<React.SetStateAction<any[]>>;
  setDebt: React.Dispatch<React.SetStateAction<any[]>>;
  setExpenses: React.Dispatch<React.SetStateAction<any[]>>;
  setGroupDetails: React.Dispatch<React.SetStateAction<{ concept: string; detail: any }[]>>;
}) {
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
      ]);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('There was an error!', error);
    });
}

export function marksAsPaid(
  token: string,
  account: string | null,
  row: ItemDetail,
  setReload: React.Dispatch<React.SetStateAction<boolean>>,
) {
  console.log(account);
  const MarkAsPaidUrl = `${url}transactions/mark-receipt-as-paid?group_id=${account}&user_id=${row.user}&month=${
    row.name.split(' ')[1]
  }&year=${row.name.split(' ')[2]}`;
  axios
    .post(MarkAsPaidUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      setReload(true);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('There was an error!', error);
    });
}
