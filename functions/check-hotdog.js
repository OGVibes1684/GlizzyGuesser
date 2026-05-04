import { env } from "cloudflare:workers";
console.log(`Hi, ${env.Name}`);
export async function onRequestPost(context) {
  try {
    const { base64Image, mimeType } = await context.request.json();

    if (!base64Image || !mimeType) {
      return json({ error: 'Missing base64Image or mimeType.' }, 400);
    }

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${context.env.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}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 10,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Does this image contain a hot dog? Reply with only the word "yes" or "no".' },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } }
            ]
          }
        ]
      })
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      return json({ error: data.error?.message || 'OpenAI API error.' }, 500);
    }

    const answer = data.choices[0].message.content.trim().toLowerCase();
    return json({ result: answer });

  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}