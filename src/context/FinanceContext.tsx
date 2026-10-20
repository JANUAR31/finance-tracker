import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, WalletKey, ALL_WALLET_KEYS } from '../types';
import { loadTransactions, saveTransactions } from '../utils/storage';

interface FinanceContextValue {
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (t: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  balances: Record<WalletKey, number>;      // saldo per kantong (dingin, panas-saldo, panas-cash)
  panasTotal: number;                        // gabungan panas-saldo + panas-cash
  totalBalance: number;                      // semua kantong dijumlah
  expenseByCategory: Record<string, number>;
}

const FinanceContext = createContext<FinanceContextValue | undefined>(undefined);

function emptyBalances(): Record<WalletKey, number> {
  return { dingin: 0, 'panas-saldo': 0, 'panas-cash': 0 };
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTransactions().then((data) => {
      setTransactions(data);
      setIsLoading(false);
    });
  }, []);

  const persist = useCallback(async (next: Transaction[]) => {
    setTransactions(next);
    await saveTransactions(next);
  }, []);

  const addTransaction = useCallback(
    async (t: Omit<Transaction, 'id'>) => {
      const newTx: Transaction = { ...t, id: uuidv4() };
      await persist([newTx, ...transactions]);
    },
    [transactions, persist]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      await persist(transactions.filter((t) => t.id !== id));
    },
    [transactions, persist]
  );

  const balances = useMemo(() => {
    const result = emptyBalances();
    for (const t of transactions) {
      if (t.type === 'income') {
        result[t.wallet] += t.amount;
      } else if (t.type === 'expense') {
        result[t.wallet] -= t.amount;
      } else if (t.type === 'transfer' && t.toWallet) {
        result[t.wallet] -= t.amount;
        result[t.toWallet] += t.amount;
      }
    }
    return result;
  }, [transactions]);

  const panasTotal = balances['panas-saldo'] + balances['panas-cash'];
  const totalBalance = balances.dingin + panasTotal;

  const expenseByCategory = useMemo(() => {
    const result: Record<string, number> = {};
    for (const t of transactions) {
      if (t.type === 'expense') {
        result[t.category] = (result[t.category] || 0) + t.amount;
      }
    }
    return result;
  }, [transactions]);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        isLoading,
        addTransaction,
        deleteTransaction,
        balances,
        panasTotal,
        totalBalance,
        expenseByCategory,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance harus dipakai di dalam FinanceProvider');
  return ctx;
}
