const axios = require('axios');

// Vercel serverless function handler
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text_to_summarize } = req.body; // Extract the text to summarize

    if (!text_to_summarize) {
      return res.status(400).json({ error: 'No text provided for summarization.' });
    }

    let data = JSON.stringify({
      "inputs": text_to_summarize,
      "parameters": {
        "max_length": 100,
        "min_length": 30
      }
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN // Use the environment variable
      },
      data: data
    };

    console.log("API request data:", data);
    console.log("API request headers:", config.headers);

    try {
      const response = await axios.request(config);
      return res.status(200).json({ summary: response.data[0].summary_text });
    } catch (error) {
      console.error("Error during API request:", error);
      return res.status(500).json({ error: 'Failed to summarize text.' });
    }
  } else {
    // Handle other HTTP methods
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
