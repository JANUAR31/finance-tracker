import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Transaction, WALLET_LABEL } from '../types';
import { formatRupiah, formatDate } from '../utils/format';

interface Props {
  transaction: Transaction;
  onLongPress?: () => void;
}

export default function TransactionItem({ transaction, onLongPress }: Props) {
  const isIncome = transaction.type === 'income';
  const isTransfer = transaction.type === 'transfer';

  const amountColor = isTransfer ? '#555' : isIncome ? '#1E8A4C' : '#C0392B';
  const sign = isTransfer ? '' : isIncome ? '+' : '-';

  const title = isTransfer
    ? `Transfer ${WALLET_LABEL[transaction.wallet]} → ${WALLET_LABEL[transaction.toWallet!]}`
    : transaction.category;

  const subtitle = isTransfer
    ? formatDate(transaction.date)
    : `${WALLET_LABEL[transaction.wallet]} · ${formatDate(transaction.date)}`;

  return (
    <TouchableOpacity style={styles.row} onLongPress={onLongPress} delayLongPress={400}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {!!transaction.note && <Text style={styles.note}>{transaction.note}</Text>}
      </View>
      <Text style={[styles.amount, { color: amountColor }]}>
        {sign}{formatRupiah(transaction.amount)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  title: { fontSize: 15, fontWeight: '600', color: '#222' },
  subtitle: { fontSize: 12, color: '#888', marginTop: 2 },
  note: { fontSize: 12, color: '#aaa', marginTop: 2, fontStyle: 'italic' },
  amount: { fontSize: 15, fontWeight: '700', marginLeft: 8 },
});
