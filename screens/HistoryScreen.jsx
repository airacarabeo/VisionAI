import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import supabase from '../lib/supabase';

export default function HistoryScreen() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadHistory() {
    const { data, error } = await supabase
      .from('analysis_history')
      .select()
      .order('created_at', { ascending: false });

    if (!error) {
      setRows(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadHistory();
  }, []);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={rows}
        keyExtractor={(item, index) => String(item.id || item.created_at || index)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.label}>Objects</Text>
            <Text style={styles.bodyText}>
              {Array.isArray(item.objects) ? item.objects.join(', ') : item.objects}
            </Text>

            <Text style={styles.label}>Context</Text>
            <Text style={styles.bodyText}>{item.context}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  listContent: {
    padding: 24,
  },
  historyItem: {
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  label: {
    marginBottom: 6,
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  bodyText: {
    marginBottom: 14,
    color: '#374151',
    fontSize: 15,
    lineHeight: 22,
  },
});
