export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await req.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return new Response('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID', { status: 500 });
    }

    const text =
      `Она дошла до конца приложения 💌\n` +
      `Событие: ${body.event || 'finished'}\n` +
      `Экран: ${body.page || 'screen-7'}\n` +
      `Время: ${body.finishedAt || new Date().toISOString()}`;

    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text
      })
    });

    if (!tgRes.ok) {
      const tgText = await tgRes.text();
      return new Response(`Telegram error: ${tgText}`, { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(`Server error: ${err.message}`, { status: 500 });
  }
};