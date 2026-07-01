import * as FileSystem from 'expo-file-system';

export async function imageToBase64(uri) {
  if (!uri) {
    throw new Error('No image found. Please retake the photo.');
  }

  try {
    return await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  } catch {
    throw new Error('Could not read this image. Please retake the photo.');
  }
}

export async function analyzeImage(base64Image, prompt) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_KEY;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64Image,
                },
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || data.error) {
    const message = data.error?.message || 'Gemini request failed.';
    const error = new Error(message);
    error.code = data.error?.status || response.status;

    if (response.status === 429 || error.code === 'RESOURCE_EXHAUSTED' || /quota/i.test(message)) {
      error.code = 'QUOTA_EXCEEDED';
    }

    throw error;
  }

  return data;
}
