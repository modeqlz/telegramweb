import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const initData = request.nextUrl.searchParams.get('initData');

    if (!initData) {
      return NextResponse.json({ ok: false, error: 'Missing initData' }, { status: 400 });
    }

    // Parse user data from initData
    let user = {
      id: 'demo_user_123',
      username: 'demouser',
      first_name: 'Demo',
      last_name: 'User',
      photo_url: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const urlParams = new URLSearchParams(initData);
      const userParam = urlParams.get('user');
      if (userParam) {
        const telegramUser = JSON.parse(decodeURIComponent(userParam));
        user = {
          id: telegramUser.id?.toString() || 'demo_user_123',
          username: telegramUser.username || 'demouser',
          first_name: telegramUser.first_name || 'Demo',
          last_name: telegramUser.last_name || 'User',
          photo_url: telegramUser.photo_url || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
    } catch (e) {
      console.log('Using demo user data');
    }

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error('Me endpoint error:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
