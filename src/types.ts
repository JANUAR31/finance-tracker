// Dingin cuma 1 kantong (saldo saja). Panas punya 2 sub-kantong: saldo & cash.
export type WalletKey = 'dingin' | 'panas-saldo' | 'panas-cash';
export type WalletGroup = 'dingin' | 'panas';

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  wallet: WalletKey;       // kantong sumber (untuk expense/income) atau kantong asal (untuk transfer)
  toWallet?: WalletKey;    // hanya diisi kalau type === 'transfer'
  note?: string;
  date: string;            // ISO string
}

export const ALL_WALLET_KEYS: WalletKey[] = ['dingin', 'panas-saldo', 'panas-cash'];

export const WALLET_LABEL: Record<WalletKey, string> = {
  dingin: 'Uang Dingin',
  'panas-saldo': 'Panas · Saldo',
  'panas-cash': 'Panas · Cash',
};

export const WALLET_GROUP_LABEL: Record<WalletGroup, string> = {
  dingin: 'Uang Dingin',
  panas: 'Uang Panas',
};

export function walletGroupOf(w: WalletKey): WalletGroup {
  return w === 'dingin' ? 'dingin' : 'panas';
}

export const EXPENSE_CATEGORIES = [
  'Makanan',
  'Transportasi',
  'Belanja',
  'Tagihan',
  'Hiburan',
  'Kesehatan',
  'Pendidikan',
  'Lainnya',
];

export const INCOME_CATEGORIES = [
  'Gaji',
  'Bonus',
  'Hadiah',
  'Investasi',
  'Lainnya',
];
