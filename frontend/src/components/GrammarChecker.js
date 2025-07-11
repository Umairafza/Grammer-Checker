import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function GrammarChecker() {
  const [text, setText] = useState('');
  const [corrections, setCorrections] = useState([]);
  const [correctedText, setCorrectedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [source, setSource] = useState('');
  const navigate = useNavigate();

  const handleCheckGrammar = async () => {
    if (!text.trim()) {
      setError('Please enter some text to check');
      return;
    }

    setLoading(true);
    setError('');
    setCorrections([]);
    setCorrectedText('');
    setSource('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:3500/api/check-grammar',
        { text },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 20000
        }
      );

      const correctionText = response.data.corrections;
      const backendCorrectedText = response.data.correctedText;
      setSource(response.data.source);

      if (correctionText && correctionText !== 'No corrections needed') {
        const correctionList = correctionText.split('\n')
          .filter(line => line.trim() && line.includes('->'))
          .map((line, index) => {
            const [originalPart, correctionPart] = line.split('->');
            return {
              id: index,
              original: originalPart?.trim(),
              corrected: correctionPart?.trim()
            };
          });
        setCorrections(correctionList);
      }

      setCorrectedText(backendCorrectedText || text);

    } catch (err) {
      console.error('Error:', err);
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else {
        setError(err.response?.data?.error || 'Failed to check grammar');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Grammar Checker</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Enter your text to check:
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Type or paste your text here..."
              disabled={loading}
            />
          </div>

          <button
            onClick={handleCheckGrammar}
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? 'Analyzing...' : 'Check Grammar'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {source && (
            <div className="mt-2 text-sm text-gray-500">
              Using: {source.includes('openai') ? 'OpenAI' : 'Basic Checker'}
            </div>
          )}
        </div>

        {corrections.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {corrections.length} Correction{corrections.length !== 1 ? 's' : ''} Found
            </h2>
            <div className="space-y-3">
              {corrections.map((correction) => (
                <div key={correction.id} className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-start">
                    <span className="text-red-500 font-medium mr-2">✖</span>
                    <span className="text-red-600">{correction.original}</span>
                  </div>
                  <div className="flex items-start mt-1">
                    <span className="text-green-500 font-medium mr-2">✔</span>
                    <span className="text-green-600">{correction.corrected}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {correctedText && correctedText !== text && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600">
              Corrected Text
            </h2>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-green-800 whitespace-pre-wrap">{correctedText}</p>
            </div>
          </div>
        )}

        {correctedText && correctedText === text && corrections.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-green-800 font-semibold">🎉 No corrections needed - your text looks great!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GrammarChecker;