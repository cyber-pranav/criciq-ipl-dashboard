// src/services/gemini.js
// Gemini AI service for CricIQ intelligent assistant

const SYSTEM_PROMPT =
  'You are CricIQ, an expert IPL cricket analyst. You have access to IPL data from 2008-2024. ' +
  'Always respond with: 1) A direct answer in 2-3 sentences 2) One key stat that supports your answer ' +
  '3) A fun fact the fan might not know. Keep responses under 150 words. ' +
  'Never say you don\'t have access to data — use your training knowledge about IPL.';

const DEMO_RESPONSES = [
  'Virat Kohli remains the all-time leading run-scorer in IPL history with over 7,200 runs. His consistency across 16+ seasons is unmatched — he averages above 37 with a strike rate north of 130. Fun fact: Kohli once scored 973 runs in a single IPL season (2016), a record that still stands!',
  'Mumbai Indians hold the record for the most IPL titles with 5 championships (2013, 2015, 2017, 2019, 2020). Their dominance in odd years became a famous meme! Key stat: MI have the highest win percentage in IPL playoff matches at over 60%. Fun fact: MI were the first team to successfully defend an IPL title in 2020.',
  'Jasprit Bumrah is widely considered the best death bowler in IPL history. His economy rate in overs 16-20 is under 7.5, which is extraordinary. Key stat: Bumrah has taken 150+ IPL wickets with an overall economy below 7.4. Fun fact: He went unsold in the 2013 auction before MI picked him up for his base price!',
  'MS Dhoni\'s captaincy record is the stuff of legends — he led CSK to 5 IPL titles and 9 finals. His calm decision-making under pressure earned him the nickname "Captain Cool." Key stat: CSK under Dhoni have a win rate above 60%. Fun fact: Dhoni has hit more sixes in the last over than any other IPL batsman!',
];

/**
 * Send a question to the Gemini API and get an IPL-expert response.
 * Falls back to a rotating demo response when no API key is configured.
 *
 * @param {string} userMessage  The user's question
 * @param {string} context      Optional additional context (e.g. current dashboard state)
 * @returns {Promise<string>}   The assistant's reply
 */
export async function askCricIQ(userMessage, context = '') {
  const apiKey = import.meta.env.VITE_GEMINI_KEY;

  if (!apiKey) {
    console.info('[CricIQ] No Gemini API key — returning demo response');
    await new Promise((r) => setTimeout(r, 600)); // simulate network latency
    return DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `${SYSTEM_PROMPT}\n\n${context ? `Context: ${context}\n\n` : ''}User question: ${userMessage}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 300,
      topP: 0.9,
      topK: 40,
    },
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error('[CricIQ] Gemini API error:', res.status, errData);
      return 'Sorry, I\'m having trouble connecting to my brain right now. Try again in a moment!';
    }

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Hmm, I couldn\'t come up with an answer. Could you rephrase that?';
    return text.trim();
  } catch (err) {
    console.error('[CricIQ] Gemini fetch failed:', err);
    return 'Network error — please check your connection and try again.';
  }
}

/**
 * Generate 3 follow-up questions a fan might ask next.
 *
 * @param {string} response  The last assistant response to derive follow-ups from
 * @returns {string[]}       Three follow-up question strings
 */
export function generateFollowUps(response) {
  if (!response) {
    return [
      'Who has the most runs in IPL history?',
      'Which team has won the most titles?',
      'What are the best IPL bowling figures?',
    ];
  }

  const lower = response.toLowerCase();

  // Contextual follow-ups based on keywords in the response
  if (lower.includes('kohli') || lower.includes('virat')) {
    return [
      'How does Kohli\'s strike rate compare to other top scorers?',
      'Which bowler has dismissed Kohli the most in IPL?',
      'What was Kohli\'s best IPL season?',
    ];
  }

  if (lower.includes('dhoni') || lower.includes('csk') || lower.includes('chennai')) {
    return [
      'How many finals has CSK played under Dhoni?',
      'Who has the best economy rate for CSK?',
      'What is CSK\'s record at Chepauk?',
    ];
  }

  if (lower.includes('mumbai') || lower.includes(' mi ') || lower.includes('rohit')) {
    return [
      'How many titles have MI won in odd years?',
      'Who is MI\'s highest wicket-taker of all time?',
      'What is Rohit Sharma\'s captaincy record in IPL?',
    ];
  }

  if (lower.includes('bumrah') || lower.includes('bowl') || lower.includes('wicket')) {
    return [
      'Who has the best economy rate in IPL history?',
      'What are the best bowling figures in a single IPL match?',
      'Which spinner has taken the most IPL wickets?',
    ];
  }

  if (lower.includes('gayle') || lower.includes('six') || lower.includes('power')) {
    return [
      'Who has hit the most sixes in IPL history?',
      'What is the fastest century in IPL?',
      'Which venue sees the most sixes per match?',
    ];
  }

  // Default follow-ups
  return [
    'Who are the top 5 run-scorers this season?',
    'Which team has the best win percentage?',
    'What are the biggest upsets in IPL history?',
  ];
}
