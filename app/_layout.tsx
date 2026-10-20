import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FinanceProvider } from '../src/context/FinanceContext';

export default function RootLayout() {
  return (
    <FinanceProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#1E1E1E',
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: 'Tambah',
            tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="wallets"
          options={{
            title: 'Wallets',
            tabBarIcon: ({ color, size }) => <Ionicons name="wallet" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            title: 'Laporan',
            tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" size={size} color={color} />,
          }}
        />
      </Tabs>
    </FinanceProvider>
  );
}
