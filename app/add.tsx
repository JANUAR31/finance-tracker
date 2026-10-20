import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFinance } from '../src/context/FinanceContext';
import {
  TransactionType,
  WalletKey,
  WalletGroup,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  WALLET_GROUP_LABEL,
} from '../src/types';

export default function AddTransactionScreen() {
  const { addTransaction } = useFinance();
  const router = useRouter();

  const [type, setType] = useState<TransactionType>('expense');
  const [group, setGroup] = useState<WalletGroup>('panas');
  const [panasSub, setPanasSub] = useState<'saldo' | 'cash'>('cash');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Dingin cuma 1 kantong (saldo). Panas ada 2 sub-kantong: saldo & cash.
  const wallet: WalletKey = group === 'dingin' ? 'dingin' : (`panas-${panasSub}` as WalletKey);

  const handleTypeChange = (t: TransactionType) => {
    setType(t);
    const newCategories = t === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    setCategory(newCategories[0]);
  };

  const handleSubmit = async () => {
    const numericAmount = Number(amount.replace(/[^0-9]/g, ''));
    if (!numericAmount || numericAmount <= 0) {
      Alert.alert('Jumlah tidak valid', 'Masukkan nominal lebih dari 0.');
      return;
    }
    await addTransaction({
      type,
      amount: numericAmount,
      category,
      wallet,
      note: note.trim() || undefined,
      date: new Date().toISOString(),
    });
    setAmount('');
    setNote('');
    Alert.alert('Tersimpan', 'Transaksi berhasil ditambahkan.', [
      { text: 'OK', onPress: () => router.push('/') },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.label}>Jenis</Text>
        <View style={styles.pillRow}>
          {(['expense', 'income'] as TransactionType[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.pill, type === t && styles.pillActive]}
              onPress={() => handleTypeChange(t)}
            >
              <Text style={[styles.pillText, type === t && styles.pillTextActive]}>
                {t === 'expense' ? 'Pengeluaran' : 'Pemasukan'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Wallet</Text>
        <View style={styles.pillRow}>
          {(['panas', 'dingin'] as WalletGroup[]).map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.pill, group === g && styles.pillActive]}
              onPress={() => setGroup(g)}
            >
              <Text style={[styles.pillText, group === g && styles.pillTextActive]}>
                {WALLET_GROUP_LABEL[g]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {group === 'panas' && (
          <>
            <Text style={styles.label}>Sub-kantong Panas</Text>
            <View style={styles.pillRow}>
              {(['saldo', 'cash'] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.pill, panasSub === s && styles.pillActive]}
                  onPress={() => setPanasSub(s)}
                >
                  <Text style={[styles.pillText, panasSub === s && styles.pillTextActive]}>
                    {s === 'saldo' ? 'Saldo' : 'Cash'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <Text style={styles.label}>Kategori</Text>
        <View style={styles.pillRowWrap}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.pillSmall, category === c && styles.pillActive]}
              onPress={() => setCategory(c)}
            >
              <Text style={[styles.pillText, category === c && styles.pillTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Jumlah (Rp)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="0"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>Catatan (opsional)</Text>
        <TextInput
          style={styles.input}
          placeholder="mis. makan siang bareng teman"
          value={note}
          onChangeText={setNote}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Simpan Transaksi</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 16, marginBottom: 8 },
  pillRow: { flexDirection: 'row', gap: 8 },
  pillRowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  pillSmall: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
  },
  pillActive: { backgroundColor: '#1E1E1E' },
  pillText: { color: '#444', fontWeight: '500' },
  pillTextActive: { color: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#1E1E1E',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
