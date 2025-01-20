import { Dispatch, SetStateAction, createContext } from 'react';

export interface GroupDetail {
  concept: string;
  detail: string;
}

interface SettingsContext {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  account: string | null;
  setAccount: Dispatch<SetStateAction<string | null>>;
  userFilter: string;
  setUserFilter: Dispatch<SetStateAction<string>>;
  reload: boolean;
  setReload: Dispatch<SetStateAction<boolean>>;
  income: ItemDetail[];
  setIncome: Dispatch<SetStateAction<ItemDetail[]>>;
  debt: ItemDetail[];
  setDebt: Dispatch<SetStateAction<ItemDetail[]>>;
  expenses: ItemDetail[];
  setExpenses: Dispatch<SetStateAction<ItemDetail[]>>;
  groupDetails: GroupDetail[];
  setGroupDetails: Dispatch<SetStateAction<GroupDetail[]>>;
}

const settingsContext = createContext<SettingsContext | undefined>(undefined);

export default settingsContext;
