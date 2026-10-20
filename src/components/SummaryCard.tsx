import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatRupiah } from '../utils/format';

interface SubRow {
  label: string;
  amount: number;
}

interface Props {
  label: string;
  amount: number;
  color?: string;
  subRows?: SubRow[];
}

export default function SummaryCard({ label, amount, color = '#1E1E1E', subRows }: Props) {
  return (
    <View style={[styles.card, { borderColor: color }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.amount, { color }]}>{formatRupiah(amount)}</Text>
      {subRows && subRows.length > 0 && (
        <View style={styles.subRowsBox}>
          {subRows.map((row) => (
            <View key={row.label} style={styles.subRow}>
              <Text style={styles.subRowLabel}>{row.label}</Text>
              <Text style={styles.subRowAmount}>{formatRupiah(row.amount)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 13,
    color: '#777',
    marginBottom: 6,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
  },
  subRowsBox: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  subRowLabel: {
    fontSize: 12,
    color: '#999',
  },
  subRowAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
});
