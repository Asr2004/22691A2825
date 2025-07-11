import React, { useState, useEffect } from 'react';
import { Link, Copy, Check, Trash2, Search, BarChart3, QrCode, Calendar, MousePointer } from 'lucide-react';

interface ShortenedURL {
  id: string;
  original: string;
  shortened: string;
  clicks: number;
  createdAt: Date;
  qrCode?: string;
}

function App() {
  const [url, setUrl] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedURL[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showQR, setShowQR] = useState<string | null>(null);

  // Load saved URLs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('shortenedUrls');
    if (saved) {
      const parsed = JSON.parse(saved).map((url: any) => ({
        ...url,
        createdAt: new Date(url.createdAt)
      }));
      setShortenedUrls(parsed);
    }
  }, []);

  // Save URLs to localStorage
  useEffect(() => {
    localStorage.setItem('shortenedUrls', JSON.stringify(shortenedUrls));
  }, [shortenedUrls]);

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const generateShortUrl = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `https://short.ly/${result}`;
  };

  const handleShorten = async () => {
    if (!url.trim()) return;
    
    if (!isValidUrl(url)) {
      alert('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUrl: ShortenedURL = {
      id: Date.now().toString(),
      original: url,
      shortened: generateShortUrl(),
      clicks: Math.floor(Math.random() * 1000),
      createdAt: new Date(),
    };

    setShortenedUrls(prev => [newUrl, ...prev]);
    setUrl('');
    setIsLoading(false);
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDelete = (id: string) => {
    setShortenedUrls(prev => prev.filter(url => url.id !== id));
  };

  const filteredUrls = shortenedUrls.filter(url => 
    url.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.shortened.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Link className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LinkShort
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <BarChart3 className="w-4 h-4" />
                <span>{shortenedUrls.length} URLs shortened</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shorten Your URLs
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Share With Style
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform long, complex URLs into short, memorable links that are easy to share and track.
          </p>
        </div>

        {/* URL Shortener Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your URL
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very-long-url-that-needs-shortening"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && handleShorten()}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleShorten}
                disabled={!url.trim() || isLoading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Shortening...</span>
                  </div>
                ) : (
                  'Shorten URL'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search and Stats */}
        {shortenedUrls.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search URLs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <MousePointer className="w-4 h-4" />
                  <span>{shortenedUrls.reduce((acc, url) => acc + url.clicks, 0)} total clicks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{shortenedUrls.length} URLs</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* URLs List */}
        {filteredUrls.length > 0 ? (
          <div className="space-y-4">
            {filteredUrls.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-500">Original URL</span>
                      <p className="text-gray-900 truncate">{item.original}</p>
                    </div>
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-500">Shortened URL</span>
                      <p className="text-blue-600 font-medium">{item.shortened}</p>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MousePointer className="w-4 h-4" />
                        <span>{item.clicks} clicks</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{item.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopy(item.shortened, item.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowQR(showQR === item.id ? null : item.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>QR</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
                {showQR === item.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center">
                      <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                        <QrCode className="w-16 h-16 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-2">
                      QR Code for {item.shortened}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : shortenedUrls.length > 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No URLs found matching your search.</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <Link className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No URLs shortened yet. Enter a URL above to get started!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 LinkShort. Built with React and Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;