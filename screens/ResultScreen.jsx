import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import { analyzeImage } from '../lib/gemini';

const ANALYSIS_PROMPT = `Analyze this image and return ONLY valid JSON in this exact shape:
{
  "objects": [],
  "context": "",
  "activities": "",
  "recommendations": ""
}`;

export default function ResultScreen({ route }) {
  const { base64Image } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  async function runAnalysis() {
    try {
      const result = await analyzeImage(base64Image, ANALYSIS_PROMPT);
      const text = result.candidates[0].content.parts[0].text;
      const parsedAnalysis = JSON.parse(text);

      setAnalysis(parsedAnalysis);
    } catch {
      setError('Could not analyze this image. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runAnalysis();
  }, []);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Analyzing image...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Objects:</Text>
        {analysis.objects.map((object, index) => (
          <Text key={`${object}-${index}`} style={styles.bodyText}>
            - {object}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Context:</Text>
        <Text style={styles.bodyText}>{analysis.context}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activities:</Text>
        <Text style={styles.bodyText}>{analysis.activities}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations:</Text>
        <Text style={styles.bodyText}>{analysis.recommendations}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
  },
  bodyText: {
    color: '#374151',
    fontSize: 16,
    lineHeight: 24,
  },
});
