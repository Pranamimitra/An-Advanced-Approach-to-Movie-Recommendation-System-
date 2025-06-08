import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiMessageCircle, FiSend, FiRefreshCw } from 'react-icons/fi';
import { marked } from 'marked';

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (retry = false) => {
    if (!userInput.trim() && !retry) return;

    const inputToSend = retry ? messages[messages.length - 1].text : userInput;
    if (!retry) {
      const newMessages = [
        ...messages,
        {
          text: inputToSend,
          type: 'user',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];
      setMessages(newMessages);
      setUserInput('');
    }
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post('http://localhost:5000/chat', {
        message: inputToSend,
      });

      // Clean and format the response using marked.js for markdown
      const cleanResponse = marked.parse(res.data.reply.replace(/[*_~`]/g, ''));

      setMessages((prev) => [
        ...prev,
        {
          text: cleanResponse,
          type: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setError('Failed to get response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    sendMessage(true);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-700 to-amber-600 text-white px-5 py-3 rounded-full shadow-lg hover:from-amber-800 hover:to-amber-700 transition-all duration-300 transform hover:scale-105"
          >
            <FiMessageCircle size={24} />
            <span className="font-medium text-sm">Chat with MovieBot</span>
          </button>
        </div>
      )}

      {/* Chatbox Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-[400px] h-[500px] bg-gray-800 border border-amber-600 rounded-2xl shadow-2xl flex flex-col z-50 animate-slide-up">
          {/* Header */}
          <div className="p-4 bg-gray-900 border-b border-amber-600 rounded-t-2xl flex justify-between items-center">
            <div>
              <h1 className="text-white text-lg font-serif font-bold">MovieBot</h1>
              <p className="text-amber-200 text-xs font-sans">Your movie guide</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-amber-400 hover:text-amber-200 transition text-lg font-bold"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto text-sm text-white font-sans space-y-3 bg-gray-800">
            {messages.length === 0 && !loading && (
              <p className="text-amber-300 italic text-center">Ask me anything about movies...</p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-[80%] shadow-md ${
                    m.type === 'user'
                      ? 'bg-amber-700 text-white'
                      : 'bg-gray-700 text-white border border-amber-600'
                  }`}
                >
                  <div
                    className="prose prose-invert text-sm"
                    dangerouslySetInnerHTML={{ __html: m.text }}
                  />
                  <p className="text-xs text-amber-300 mt-1">{m.timestamp}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-center">
                <div className="animate-pulse flex space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                </div>
              </div>
            )}
            {error && (
              <div className="text-center">
                <p className="text-red-400 text-sm">{error}</p>
                <button
                  onClick={handleRetry}
                  className="mt-2 flex items-center gap-1 mx-auto text-amber-400 hover:text-amber-200 transition"
                >
                  <FiRefreshCw size={16} />
                  Retry
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex items-center p-3 border-t border-amber-600 bg-gray-900 rounded-b-2xl">
            <input
              className="flex-1 bg-gray-700 text-white placeholder-amber-300 p-2 rounded-l-lg focus:outline-none border border-amber-600 border-r-0"
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about movies..."
            />
            <button
              onClick={() => sendMessage()}
              className="bg-amber-600 text-gray-900 px-4 py-2 rounded-r-lg hover:bg-amber-500 transition-all flex items-center gap-2"
            >
              <FiSend size={16} />
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbox;