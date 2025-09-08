import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isValidTelegramInitData, getUserFromInitData } from '@/lib/telegram';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE!;
const botToken = process.env.BOT_TOKEN!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const initData = searchParams.get('initData');

    if (!initData) {
      return NextResponse.json({ ok: false, error: 'Missing initData' }, { status: 400 });
    }

    // Validate Telegram data
    if (!isValidTelegramInitData(initData, botToken)) {
      return NextResponse.json({ ok: false, error: 'Invalid Telegram data' }, { status: 401 });
    }

    // Extract user data
    const telegramUser = getUserFromInitData(initData);
    if (!telegramUser || !telegramUser.id) {
      return NextResponse.json({ ok: false, error: 'Invalid user data' }, { status: 400 });
    }

    // Create Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceRole, {
      auth: { persistSession: false }
    });

    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', telegramUser.id)
      .single();

    if (error) {
      console.error('Supabase select error:', error);
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error('Me endpoint error:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
