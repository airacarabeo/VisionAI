import { useState } from 'react';
import { ActivityIndicator, View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { imageToBase64 } from '../lib/gemini';

export default function PreviewScreen({ route, navigation }) {
  const { base64Image, photoUri } = route.params;
  const [selectedPrompt, setSelectedPrompt] = useState('academic');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const goAnalyze = async () => {
    if (isAnalyzing) {
      return;
    }

    try {
      setError(null);
      setIsAnalyzing(true);

      const imageData = base64Image || (await imageToBase64(photoUri));
      navigation.navigate('Result', { base64Image: imageData, promptKey: selectedPrompt });
    } catch (prepareError) {
      setError(prepareError.message || 'Could not prepare this image. Please retake the photo.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.previewImage} resizeMode="contain" />

      <View style={styles.personaRow}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          disabled={isAnalyzing}
          style={[
            styles.personaButton,
            styles.academicButton,
            selectedPrompt === 'academic' && styles.selectedButton,
            isAnalyzing && styles.disabledButton,
          ]}
          onPress={() => setSelectedPrompt('academic')}>
          <Text style={styles.personaLabel}>Academic Analysis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isAnalyzing}
          style={[
            styles.personaButton,
            styles.safetyButton,
            selectedPrompt === 'safety' && styles.selectedButton,
            isAnalyzing && styles.disabledButton,
          ]}
          onPress={() => setSelectedPrompt('safety')}>
          <Text style={styles.personaLabel}>Safety Analysis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isAnalyzing}
          style={[
            styles.personaButton,
            styles.inventoryButton,
            selectedPrompt === 'inventory' && styles.selectedButton,
            isAnalyzing && styles.disabledButton,
          ]}
          onPress={() => setSelectedPrompt('inventory')}>
          <Text style={styles.personaLabel}>Inventory Analysis</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.retakeButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isAnalyzing}
          style={[styles.button, styles.analyzeButton, isAnalyzing && styles.disabledButton]}
          onPress={goAnalyze}>
          {isAnalyzing ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Analyze</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  personaRow: {
    gap: 10,
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: '#000',
  },
  personaButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  academicButton: {
    backgroundColor: '#2563EB',
  },
  safetyButton: {
    backgroundColor: '#DC2626',
  },
  inventoryButton: {
    backgroundColor: '#059669',
  },
  personaLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.65,
  },
  selectedButton: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 36,
    backgroundColor: '#000',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: 8,
  },
  retakeButton: {
    backgroundColor: '#4B5563',
  },
  analyzeButton: {
    backgroundColor: '#2563EB',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
