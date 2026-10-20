import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types';

const STORAGE_KEY = '@finance_tracker_transactions';

export async function loadTransactions(): Promise<Transaction[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Transaction[];
  } catch (e) {
    console.error('Gagal load transaksi:', e);
    return [];
  }
}

export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.error('Gagal simpan transaksi:', e);
  }
}
