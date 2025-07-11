require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Configuration
const PORT = process.env.PORT || 3500;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Mock database
const users = [
  { id: 1, username: 'test', password: 'password123' }
];

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.post('/api/check-grammar', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Invalid text input' });
    }

    if (!OPENAI_API_KEY) {
      const { corrections, correctedText } = basicGrammarCheck(text);
      return res.json({ 
        corrections,
        correctedText,
        source: 'basic'
      });
    }

    const openAIResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an advanced grammar checker. Provide corrections in this format:
              CORRECTIONS:
              [original] -> [corrected] (Explanation: [brief reason])
              [next correction if any]
              CORRECTED_TEXT:
              [fully corrected version]`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    const aiResponse = openAIResponse.data.choices[0].message.content;
    const { corrections, correctedText } = parseAIResponse(aiResponse);

    res.json({
      corrections,
      correctedText,
      source: 'openai-gpt-3.5-turbo'
    });

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    
    // Fallback to basic check
    const { corrections, correctedText } = basicGrammarCheck(req.body.text || '');
    res.json({
      corrections,
      correctedText,
      source: 'fallback',
      error: 'OpenAI service unavailable'
    });
  }
});

// Helper functions
function parseAIResponse(response) {
  const lines = response.split('\n');
  const corrections = [];
  let correctedText = '';
  let section = null;

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('CORRECTIONS:')) {
      section = 'corrections';
      continue;
    }
    
    if (trimmed.startsWith('CORRECTED_TEXT:')) {
      section = 'correctedText';
      correctedText = trimmed.replace('CORRECTED_TEXT:', '').trim();
      continue;
    }
    
    if (section === 'corrections' && trimmed.includes('->')) {
      corrections.push(trimmed);
    } else if (section === 'correctedText' && !correctedText) {
      correctedText = trimmed;
    }
  }

  return {
    corrections: corrections.length ? corrections.join('\n') : 'No corrections needed',
    correctedText: correctedText || 'No corrected text provided'
  };
}

function basicGrammarCheck(text) {
  // Simple capitalization fix
  let corrected = text.trim();
  if (corrected.length > 0) {
    corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
    if (!['.', '!', '?'].includes(corrected.slice(-1))) {
      corrected += '.';
    }
  }

  const corrections = [];
  if (corrected !== text) {
    corrections.push(`${text} -> ${corrected} (Explanation: Basic formatting)`);
  }

  return {
    corrections: corrections.join('\n') || 'No corrections needed',
    correctedText: corrected
  };
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('OpenAI:', OPENAI_API_KEY ? 'Enabled' : 'Disabled (using basic checker)');
});