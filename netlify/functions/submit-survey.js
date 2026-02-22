// netlify/functions/submit-survey.js
// Place this file at: netlify/functions/submit-survey.js in your repo root

export default async (req, context) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Get the webhook URL from Netlify environment variable (never exposed to browser)
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return new Response('Webhook not configured', { status: 500 });
  }

  try {
    const payload = await req.json();

    const discordRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (discordRes.ok || discordRes.status === 204) {
      return new Response(null, { status: 204 });
    } else {
      return new Response(`Discord error: ${discordRes.status}`, { status: 502 });
    }
  } catch (err) {
    return new Response(`Server error: ${err.message}`, { status: 500 });
  }
};

export const config = { path: '/api/submit-survey' };
