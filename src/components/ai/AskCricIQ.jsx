import React, { useState, useRef, useEffect } from 'react';
import { IconSend, IconSparkles } from '@tabler/icons-react';
import useIPLStore from '../../store/useIPLStore';
import { askCricIQ, generateFollowUps } from '../../services/gemini';

const SUGGESTED_QUESTIONS = [
  'Who is the best death bowler in IPL history?',
  'Compare Kohli and Rohit as captains',
  'Which team performs best in Mumbai?',
  'Explain DLS method simply',
  'Who has the most Player of the Match awards?',
  'Best IPL final ever?',
  'Most expensive over in IPL?',
  'Which team should I support?',
];

function ChatSkeleton() {
  return (
    <div className="chat-ai space-y-3">
      <div className="flex items-center gap-2 text-cyan text-xs mb-2">
        <IconSparkles size={14} stroke={1.5} />
        <span>CricIQ is analyzing...</span>
      </div>
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-5/6 rounded" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-4 w-4/6 rounded" />
    </div>
  );
}

function MessageBubble({ message, onFollowUp }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="chat-user">
          <p className="text-text text-sm">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="chat-ai">
        <div className="text-text text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>

        {/* Follow-up chips */}
        {message.followUps && message.followUps.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-2">
            {message.followUps.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onFollowUp(q)}
                className="chip text-xs"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AskCricIQ({ initialQuery = '' }) {
  const chatMessages = useIPLStore((s) => s.chatMessages) || [];
  const addChatMessage = useIPLStore((s) => s.addChatMessage);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const initialQuerySent = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isLoading]);

  // Auto-send initialQuery on mount (e.g. from /ask?q=... or PlayerProfile link)
  useEffect(() => {
    if (initialQuery && !initialQuerySent.current) {
      initialQuerySent.current = true;
      // Small delay to allow UI to mount before sending
      const timer = setTimeout(() => handleSend(initialQuery), 300);
      return () => clearTimeout(timer);
    }
  }, [initialQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = async (question) => {
    const text = question || input.trim();
    if (!text || isLoading) return;

    // Add user message
    const userMsg = { role: 'user', content: text };
    if (addChatMessage) {
      addChatMessage(userMsg);
    }

    setInput('');
    setIsLoading(true);

    try {
      // Call AI service
      const response = await askCricIQ(text);
      let followUps = [];
      try {
        followUps = generateFollowUps(response);
      } catch (e) {
        followUps = [
          'Tell me more',
          'Compare with another player',
          'Show historical stats',
        ];
      }

      const aiMsg = {
        role: 'assistant',
        content: response || 'I could not generate a response. Please try again.',
        followUps: followUps.slice(0, 3),
      };

      if (addChatMessage) {
        addChatMessage(aiMsg);
      }
    } catch (err) {
      const errorMsg = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your question. Please try again.',
        followUps: [],
      };
      if (addChatMessage) {
        addChatMessage(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full min-h-[600px] border border-border rounded-lg overflow-hidden bg-navy">
      {/* Left panel: suggested questions */}
      <div className="w-72 shrink-0 border-r border-border p-4 hidden md:flex flex-col gap-4 bg-surface">
        <h3 className="text-muted text-xs uppercase tracking-wider font-medium">
          Suggested Questions
        </h3>
        <div className="flex flex-col gap-2 overflow-y-auto">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="chip text-left text-xs leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Right panel: chat */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="px-5 py-3 border-b border-border flex items-center gap-2">
          <IconSparkles size={18} className="text-cyan" stroke={1.5} />
          <span className="text-text text-sm font-medium">Ask CricIQ</span>
          <span className="text-muted text-xs ml-2">Powered by Gemini</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {chatMessages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <IconSparkles size={32} className="text-cyan opacity-40" stroke={1.5} />
              <p className="text-muted text-sm">
                Ask me anything about IPL cricket.
              </p>
              <p className="text-muted text-xs">
                Stats, comparisons, records, history — I have it all.
              </p>

              {/* Mobile: show suggested questions inline */}
              <div className="md:hidden flex flex-wrap gap-2 mt-4 justify-center">
                {SUGGESTED_QUESTIONS.slice(0, 4).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="chip text-xs"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {chatMessages.map((msg, idx) => (
            <MessageBubble
              key={idx}
              message={msg}
              onFollowUp={(q) => handleSend(q)}
            />
          ))}

          {isLoading && <ChatSkeleton />}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="px-4 py-3 border-t border-border bg-surface">
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about IPL stats, records, players..."
              disabled={isLoading}
              className="flex-1 bg-navy text-text text-sm border border-border rounded-lg px-4 py-2.5 outline-none focus:border-cyan transition-colors placeholder:text-muted disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="shrink-0 bg-cyan text-navy px-4 py-2.5 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-opacity flex items-center gap-2"
            >
              <IconSend size={16} stroke={2} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
