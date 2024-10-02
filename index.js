require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5500;
const summarizeText = require('./summarize.js');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/summarize', (req, res) => {
  const text = req.body.text_to_summarize;
  summarizeText(text)
    .then(response => {
      res.send(response);
    })
    .catch(error => {
      console.error("Error during summarization:", error);
      res.status(500).send("Failed to summarize text.");
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
