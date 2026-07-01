import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { imageToBase64 } from '../lib/gemini';

export default function PreviewScreen({ route, navigation }) {
  const { photoUri } = route.params;

  const goAnalyze = async (promptKey) => {
    const base64Image = await imageToBase64(photoUri);
    navigation.navigate('Result', { base64Image, promptKey });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.previewImage} resizeMode="contain" />

      <View style={styles.personaRow}>
        <TouchableOpacity style={[styles.personaButton, styles.academicButton]} onPress={() => goAnalyze('academic')}>
          <Text style={styles.personaLabel}>Academic Analysis</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.personaButton, styles.safetyButton]} onPress={() => goAnalyze('safety')}>
          <Text style={styles.personaLabel}>Safety Analysis</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.personaButton, styles.inventoryButton]} onPress={() => goAnalyze('inventory')}>
          <Text style={styles.personaLabel}>Inventory Analysis</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.retakeButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Retake</Text>
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
