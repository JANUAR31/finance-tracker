import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useFinance } from '../src/context/FinanceContext';
import { WalletKey, WALLET_LABEL, ALL_WALLET_KEYS } from '../src/types';
import { formatRupiah } from '../src/utils/format';

export default function WalletsScreen() {
  const { balances, panasTotal, addTransaction } = useFinance();
  const [from, setFrom] = useState<WalletKey>('dingin');
  const [to, setTo] = useState<WalletKey>('panas-saldo');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const toOptions = useMemo(() => ALL_WALLET_KEYS.filter((w) => w !== from), [from]);

  const handleFromChange = (w: WalletKey) => {
    setFrom(w);
    if (to === w) {
      setTo(ALL_WALLET_KEYS.find((k) => k !== w)!);
    }
  };

  const handleTransfer = async () => {
    const numericAmount = Number(amount.replace(/[^0-9]/g, ''));
    if (!numericAmount || numericAmount <= 0) {
      Alert.alert('Jumlah tidak valid', 'Masukkan nominal lebih dari 0.');
      return;
    }
    if (numericAmount > balances[from]) {
      Alert.alert('Saldo tidak cukup', `Saldo ${WALLET_LABEL[from]} tidak mencukupi.`);
      return;
    }
    await addTransaction({
      type: 'transfer',
      amount: numericAmount,
      category: 'Transfer',
      wallet: from,
      toWallet: to,
      note: note.trim() || undefined,
      date: new Date().toISOString(),
    });
    setAmount('');
    setNote('');
    Alert.alert('Berhasil', `Transfer dari ${WALLET_LABEL[from]} ke ${WALLET_LABEL[to]} berhasil.`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.walletCard}>
        <Text style={styles.walletLabel}>{WALLET_LABEL.dingin}</Text>
        <Text style={[styles.walletAmount, { color: '#2E86DE' }]}>{formatRupiah(balances.dingin)}</Text>
        <Text style={styles.walletHint}>Tabungan — sebaiknya jarang disentuh</Text>
      </View>

      <View style={styles.walletCard}>
        <Text style={styles.walletLabel}>Uang Panas (total)</Text>
        <Text style={[styles.walletAmount, { color: '#E67E22' }]}>{formatRupiah(panasTotal)}</Text>
        <View style={styles.subRowInCard}>
          <Text style={styles.subItem}>{WALLET_LABEL['panas-saldo']}: {formatRupiah(balances['panas-saldo'])}</Text>
          <Text style={styles.subItem}>{WALLET_LABEL['panas-cash']}: {formatRupiah(balances['panas-cash'])}</Text>
        </View>
        <Text style={styles.walletHint}>Uang aktif harian</Text>
      </View>

      <Text style={styles.sectionTitle}>Transfer Antar Kantong</Text>

      <Text style={styles.label}>Dari</Text>
      <View style={styles.pillRowWrap}>
        {ALL_WALLET_KEYS.map((w) => (
          <TouchableOpacity
            key={w}
            style={[styles.pill, from === w && styles.pillActive]}
            onPress={() => handleFromChange(w)}
          >
            <Text style={[styles.pillText, from === w && styles.pillTextActive]}>{WALLET_LABEL[w]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Ke</Text>
      <View style={styles.pillRowWrap}>
        {toOptions.map((w) => (
          <TouchableOpacity
            key={w}
            style={[styles.pill, to === w && styles.pillActive]}
            onPress={() => setTo(w)}
          >
            <Text style={[styles.pillText, to === w && styles.pillTextActive]}>{WALLET_LABEL[w]}</Text>
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
        placeholder="mis. kepepet buat bayar listrik"
        value={note}
        onChangeText={setNote}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleTransfer}>
        <Text style={styles.submitText}>Transfer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  walletCard: {
    backgroundColor: '#F7F7F7',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },
  walletLabel: { fontSize: 14, color: '#888' },
  walletAmount: { fontSize: 26, fontWeight: '800', marginTop: 4 },
  walletHint: { fontSize: 12, color: '#aaa', marginTop: 6 },
  subRowInCard: { flexDirection: 'row', gap: 16, marginTop: 8 },
  subItem: { fontSize: 12, color: '#666' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 20, marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 12, marginBottom: 8 },
  pillRow: { flexDirection: 'row', gap: 8 },
  pillRowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#F0F0F0' },
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
    marginBottom: 40,
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
