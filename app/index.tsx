import React from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useFinance } from '../src/context/FinanceContext';
import SummaryCard from '../src/components/SummaryCard';
import TransactionItem from '../src/components/TransactionItem';
import { formatRupiah } from '../src/utils/format';

export default function DashboardScreen() {
  const { transactions, balances, panasTotal, totalBalance, deleteTransaction, isLoading } = useFinance();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const confirmDelete = (id: string) => {
    Alert.alert('Hapus transaksi?', 'Tindakan ini tidak bisa dibatalkan.', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => deleteTransaction(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Total Saldo</Text>
        <Text style={styles.totalAmount}>{formatRupiah(totalBalance)}</Text>
      </View>

      <View style={styles.row}>
        <SummaryCard label="Uang Dingin" amount={balances.dingin} color="#2E86DE" />
        <SummaryCard label="Uang Panas" amount={panasTotal} color="#E67E22" />
      </View>

      <View style={styles.subRow}>
        <Text style={styles.subBreakdown}>
          ↳ Panas: Saldo {formatRupiah(balances['panas-saldo'])} · Cash {formatRupiah(balances['panas-cash'])}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Transaksi Terbaru</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem transaction={item} onLongPress={() => confirmDelete(item.id)} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Belum ada transaksi. Tambahkan lewat tab "Tambah".</Text>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7', paddingTop: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  totalBox: { alignItems: 'center', marginBottom: 16 },
  totalLabel: { fontSize: 14, color: '#888' },
  totalAmount: { fontSize: 32, fontWeight: '800', color: '#1E1E1E', marginTop: 4 },
  row: { flexDirection: 'row', paddingHorizontal: 12, marginBottom: 4 },
  subRow: { paddingHorizontal: 16, marginBottom: 20 },
  subBreakdown: { fontSize: 12, color: '#999' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginLeft: 16, marginBottom: 8 },
  empty: { textAlign: 'center', color: '#999', marginTop: 24, paddingHorizontal: 32 },
});
