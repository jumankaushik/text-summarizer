const axios = require('axios');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text_to_summarize } = req.body;

    if (!text_to_summarize) {
      return res.status(400).json({ error: 'No text provided for summarization.' });
    }

    console.log("Received text to summarize:", text_to_summarize); // Log the input

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
        'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN
      },
      data: data
    };

    console.log("API request data:", data);
    console.log("API request headers:", config.headers);

    try {
      const response = await axios.request(config);
      console.log("API response:", response.data); // Log the API response
      return res.status(200).json({ summary: response.data[0].summary_text });
    } catch (error) {
      console.error("Error during API request:", error.response ? error.response.data : error.message);
      return res.status(500).json({ error: 'Failed to summarize text.', details: error.response ? error.response.data : error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
