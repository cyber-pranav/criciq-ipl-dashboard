const apiKey = 'AIzaSyCF_KDcb023rHChv-vYB7nrO63wVM3vMmA';
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

const body = {
  contents: [
    {
      role: 'user',
      parts: [
        {
          text: 'Hello, respond with a short message.',
        },
      ],
    },
  ],
};

async function run() {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    console.log('Status code:', res.status);
    const data = await res.json();
    console.log('Response body:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error occurred:', err);
  }
}

run();
