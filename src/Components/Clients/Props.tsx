interface DebtItems {
  debt_detail: ItemDetail[];
}
interface IncomeItems {
  income_source: ItemDetail[];
}

interface ItemDetail {
  id: string;
  user: string;
  name: string;
  transaction_id: number;
  amount: number;
  comments: string;
  category: string;
}
