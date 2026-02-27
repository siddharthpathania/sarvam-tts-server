const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/tts', async (req, res) => {
  try {
    const text = req.body.message?.text || req.body.text;
    
    const response = await axios.post(
      'https://api.sarvam.ai/text-to-speech',
      {
        inputs: [{ text: text }],
        target_language_code: 'hi-IN',
        speaker: 'pavithra',
        pace: 1.0,
        speech_sample_rate: 8000,
        enable_preprocessing: true,
        model: 'bulbul:v3'
      },
      {
        headers: {
          'api-subscription-key': process.env.SARVAM_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const audioBase64 = response.data.audios[0];
    const audioBuffer = Buffer.from(audioBase64, 'base64');
    res.set('Content-Type', 'audio/wav');
    res.send(audioBuffer);
  } catch (error) {
    console.error('TTS error:', error.response?.data || error.message);
    res.status(500).json({ error: 'TTS failed' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sarvam TTS server running on port ${PORT}`));
