import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

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

function parseAnalysis(text) {
  const cleanedText = text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
  const jsonStart = cleanedText.indexOf('{');
  const jsonEnd = cleanedText.lastIndexOf('}');

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('Gemini did not return JSON.');
  }

  const parsed = JSON.parse(cleanedText.slice(jsonStart, jsonEnd + 1));

  return {
    objects: Array.isArray(parsed.objects) ? parsed.objects : [],
    context: parsed.context || '',
    activities: parsed.activities || '',
    recommendations: parsed.recommendations || '',
  };
}

export default function ResultScreen({ route, navigation }) {
  const { base64Image, promptKey } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  async function runAnalysis() {
    try {
      setAnalysis(null);
      setError(null);
      setLoading(true);

      const prompt = PROMPTS[promptKey] || PROMPTS.academic;
      const result = await analyzeImage(base64Image, prompt);
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('Gemini returned an empty response.');
      }

      const parsedAnalysis = parseAnalysis(text);

      setAnalysis(parsedAnalysis);
    } catch (analysisError) {
      if (analysisError.code === 'QUOTA_EXCEEDED') {
        setError('Gemini quota exceeded. Please wait a few minutes, check your Google AI Studio quota, or use another API key.');
      } else {
        setError(analysisError.message || 'Could not analyze this image. Please try again.');
      }
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
        <View style={styles.errorActions}>
          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={() => navigation.goBack()}>
            <Text style={styles.actionButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={runAnalysis}>
            <Text style={styles.actionButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
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
  errorActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 104,
    minHeight: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
  },
  secondaryButton: {
    backgroundColor: '#4B5563',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
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
