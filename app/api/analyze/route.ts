import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const response = await fetch(
      'https://api-inference.huggingface.co/models/Hello-SimpleAI/chatgpt-detector-roberta',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.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}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
        }),
      }
    );

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('HF API Error:', error);
    return NextResponse.json({ error: 'API call failed' }, { status: 500 });
  }
}
