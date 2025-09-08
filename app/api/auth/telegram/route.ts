export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isValidTelegramInitData, getUserFromInitData } from '@/lib/telegram';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE!;
const botToken = process.env.BOT_TOKEN!;

export async function POST(request: NextRequest) {
  try {
    const { initData } = await request.json();

    if (!initData) {
      return NextResponse.json({ ok: false, error: 'Missing initData' }, { status: 400 });
    }

    // Validate Telegram data
    if (!isValidTelegramInitData(initData, botToken)) {
      return NextResponse.json({ ok: false, error: 'Invalid Telegram data' }, { status: 401 });
    }

    // Extract user data
    const user = getUserFromInitData(initData);
    if (!user || !user.id) {
      return NextResponse.json({ ok: false, error: 'Invalid user data' }, { status: 400 });
    }

    // Create Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceRole, {
      auth: { persistSession: false }
    });

    // Upsert user to database
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        username: user.username || null,
        first_name: user.first_name || null,
        last_name: user.last_name || null,
        photo_url: user.photo_url || null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase upsert error:', error);
      return NextResponse.json({ ok: false, error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
