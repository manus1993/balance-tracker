import { useState, useMemo } from 'react';
import settingsContext, { GroupDetail } from '../Contexts/settingsContext'; // Import GroupDetail type

function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState('');
  const [account, setAccount] = useState('' as string | null);
  const [userFilter, setUserFilter] = useState('');
  const [reload, setReload] = useState(false);
  const [income, setIncome] = useState<ItemDetail[]>([]);
  const [debt, setDebt] = useState<ItemDetail[]>([]);
  const [expenses, setExpenses] = useState<ItemDetail[]>([]);
  const [groupDetails, setGroupDetails] = useState<GroupDetail[]>([]); // Use GroupDetail type

  const value = useMemo(
    () => ({
      token,
      setToken,
      account,
      setAccount,
      userFilter,
      setUserFilter,
      reload,
      setReload,
      income,
      setIncome,
      debt,
      setDebt,
      expenses,
      setExpenses,
      groupDetails,
      setGroupDetails,
    }),
    [token, account, userFilter, reload, income, debt, expenses, groupDetails],
  );

  return <settingsContext.Provider value={value}>{children}</settingsContext.Provider>;
}

export default SettingsProvider;
