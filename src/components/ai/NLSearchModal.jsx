import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSearch, IconUser, IconShield, IconSparkles, IconX } from '@tabler/icons-react';
import { searchPlayersAndTeams } from '../../services/iplData';
import { askCricIQ } from '../../services/gemini';

export default function NLSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
      setAiResponse('');
      setSelectedIdx(0);
    }
  }, [isOpen]);

  // Search on query change
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setAiResponse('');
      return;
    }
    const matches = searchPlayersAndTeams(query);
    setResults(matches.slice(0, 8));
    setSelectedIdx(0);
  }, [query]);

  const isQuestion = query.includes('?') || query.toLowerCase().startsWith('who') ||
    query.toLowerCase().startsWith('what') || query.toLowerCase().startsWith('how') ||
    query.toLowerCase().startsWith('why') || query.toLowerCase().startsWith('which');

  const handleAskAI = useCallback(async () => {
    if (!query.trim()) return;
    setAiLoading(true);
    try {
      const resp = await askCricIQ(query);
      setAiResponse(resp);
    } catch {
      setAiResponse('Could not get a response. Try again.');
    }
    setAiLoading(false);
  }, [query]);

  const handleSelect = useCallback((item) => {
    setIsOpen(false);
    if (item.type === 'player') {
      navigate(`/player/${item.id}`);
    } else if (item.type === 'team') {
      navigate(`/team/${item.id}`);
    }
  }, [navigate]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIdx < results.length) {
        handleSelect(results[selectedIdx]);
      } else if (isQuestion) {
        handleAskAI();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] cmd-palette-overlay bg-black/50 modal-overlay"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-[600px] bg-surface border border-border rounded-xl overflow-hidden modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <IconSearch size={20} className="text-muted flex-shrink-0" stroke={1.5} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search stats, players, or ask a question..."
            className="cmd-palette-input"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted hover:text-text flex-shrink-0"
          >
            <IconX size={16} stroke={1.5} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {results.length > 0 && (
            <div className="py-2">
              {results.map((item, idx) => (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleSelect(item)}
                  className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                    idx === selectedIdx ? 'bg-surface-hover' : 'hover:bg-surface-hover'
                  }`}
                >
                  {item.type === 'player' ? (
                    <IconUser size={16} className="text-cyan flex-shrink-0" stroke={1.5} />
                  ) : (
                    <IconShield size={16} className="text-amber flex-shrink-0" stroke={1.5} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text truncate">{item.name}</p>
                    <p className="text-xs text-muted">
                      {item.team || ''} {item.role ? `• ${item.role}` : ''}
                    </p>
                  </div>
                  <span className="text-[10px] text-muted uppercase tracking-wider">
                    {item.type}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* AI Question option */}
          {query.trim() && isQuestion && (
            <button
              onClick={handleAskAI}
              disabled={aiLoading}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left border-t border-border transition-colors ${
                selectedIdx === results.length ? 'bg-surface-hover' : 'hover:bg-surface-hover'
              }`}
            >
              <IconSparkles size={16} className="text-cyan flex-shrink-0" stroke={1.5} />
              <div className="flex-1">
                <p className="text-sm text-text">
                  {aiLoading ? 'Asking CricIQ...' : `Ask AI: "${query}"`}
                </p>
              </div>
              <kbd className="text-[10px] text-muted bg-navy border border-border rounded px-1.5 py-0.5 font-mono">
                ↵
              </kbd>
            </button>
          )}

          {/* AI Response */}
          {aiResponse && (
            <div className="px-5 py-4 border-t border-border">
              <div className="chat-ai">
                <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!query.trim() && (
            <div className="px-5 py-8 text-center text-muted text-sm">
              <p>Type to search players, teams, or ask a question</p>
              <p className="text-xs mt-1">Prefix with "?" for AI questions</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2 border-t border-border flex items-center gap-4 text-[10px] text-muted">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
