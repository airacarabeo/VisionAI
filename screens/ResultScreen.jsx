import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import { analyzeImage } from '../lib/gemini';

const JSON_FORMAT_INSTRUCTIONS = `Return ONLY valid JSON in this exact shape:
{
  "objects": [],
  "context": "",
  "activities": "",
  "recommendations": ""
}`;

const PROMPTS = {
  academic: `Act as a university professor. Looking at this image, provide an academic-style analysis: identify the objects present, the educational context, and one piece of constructive feedback.

${JSON_FORMAT_INSTRUCTIONS}`,
  safety: `Act as a workplace safety inspector. Looking at this image, identify any visible hazards, risks, or safety concerns. If none are visible, state that clearly.

${JSON_FORMAT_INSTRUCTIONS}`,
  inventory: `Act as an asset management clerk. Looking at this image, list every visible physical asset as a clean inventory list, with no extra commentary.

${JSON_FORMAT_INSTRUCTIONS}`,
};

export default function ResultScreen({ route }) {
  const { base64Image, promptKey } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  async function runAnalysis() {
    try {
      const prompt = PROMPTS[promptKey] || PROMPTS.academic;
      const result = await analyzeImage(base64Image, prompt);
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
