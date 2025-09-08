import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { initData } = await request.json();

    if (!initData) {
      return NextResponse.json({ ok: false, error: 'Missing initData' }, { status: 400 });
    }

    // Simple validation - just check if initData exists
    // In production, you would validate with your bot token
    console.log('Auth request received:', { initData: initData.substring(0, 50) + '...' });

    // For demo purposes, extract user ID from initData
    let userId = 'demo_user';
    try {
      const urlParams = new URLSearchParams(initData);
      const userParam = urlParams.get('user');
      if (userParam) {
        const user = JSON.parse(decodeURIComponent(userParam));
        userId = user.id?.toString() || 'demo_user';
      }
    } catch (e) {
      console.log('Could not parse user from initData, using demo user');
    }

    return NextResponse.json({ 
      ok: true, 
      userId: userId,
      message: 'Authentication successful' 
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
