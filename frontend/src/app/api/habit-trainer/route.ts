import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const backendRes = await fetch(
      process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/chat/habit-trainer` : 'http://localhost:5000/chat/habit-trainer',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    return NextResponse.json({ plan: '', error: (error as Error).message || 'Unknown error' }, { status: 500 });
  }
} 