import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useFinance } from '../src/context/FinanceContext';
import { formatRupiah } from '../src/utils/format';

const CHART_COLORS = ['#2E86DE', '#E67E22', '#1E8A4C', '#C0392B', '#8E44AD', '#F39C12', '#16A085', '#7F8C8D'];

export default function ReportsScreen() {
  const { expenseByCategory } = useFinance();
  const screenWidth = Dimensions.get('window').width;

  const entries = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  const chartData = entries.map(([category, amount], i) => ({
    name: category,
    amount,
    color: CHART_COLORS[i % CHART_COLORS.length],
    legendFontColor: '#333',
    legendFontSize: 13,
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pengeluaran per Kategori</Text>

      {entries.length === 0 ? (
        <Text style={styles.empty}>Belum ada data pengeluaran untuk ditampilkan.</Text>
      ) : (
        <>
          <PieChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{ color: () => '#333' }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="8"
          />

          <View style={styles.listBox}>
            {entries.map(([category, amount], i) => (
              <View key={category} style={styles.listRow}>
                <View style={styles.legendDot} />
                <Text style={styles.categoryName}>{category}</Text>
                <Text style={styles.categoryAmount}>{formatRupiah(amount)}</Text>
                <Text style={styles.categoryPct}>
                  {total > 0 ? Math.round((amount / total) * 100) : 0}%
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
  listBox: { marginTop: 20 },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  legendDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1E1E1E', marginRight: 10 },
  categoryName: { flex: 1, fontSize: 14, color: '#333' },
  categoryAmount: { fontSize: 14, fontWeight: '600', marginRight: 10 },
  categoryPct: { fontSize: 13, color: '#999', width: 36, textAlign: 'right' },
});
