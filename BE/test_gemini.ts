import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6LD4L9jymz8QLqqGCTFjwu2QHVeJs9ZoQhLicw7CM2dDA' });

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: 'Hello'
    });
    console.log('Success:', response.text);
  } catch (e: any) {
    console.error('Error:', e.message || e);
  }
}
run();
