const ROBOFLOW_MODEL_ID = 'coco';
const ROBOFLOW_MODEL_VERSION = '8';

export async function detectObjects(base64Image) {
  try {
    const apiKey = process.env.EXPO_PUBLIC_ROBOFLOW_KEY;
    const response = await fetch(
      `https://detect.roboflow.com/${ROBOFLOW_MODEL_ID}/${ROBOFLOW_MODEL_VERSION}?api_key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: base64Image,
      }
    );

    const data = await response.json();
    return data.predictions;
  } catch {
    return [];
  }
}
