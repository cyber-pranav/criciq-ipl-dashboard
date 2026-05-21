import React from 'react';
import { useSearchParams } from 'react-router-dom';
import AskCricIQ from '../components/ai/AskCricIQ';

export default function AskAI() {
  const [searchParams] = useSearchParams();
  const prefilledQuery = searchParams.get('q') || '';

  return (
    <div className="h-full w-full min-h-[calc(100vh-8rem)]">
      <AskCricIQ initialQuery={prefilledQuery} />
    </div>
  );
}
