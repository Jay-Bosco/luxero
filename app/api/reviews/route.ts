import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { watch_id, name, email, rating, review } = body;

    // Validate required fields
    if (!watch_id || !name || !rating || !review) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Insert review - approved immediately
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert({
        watch_id,
        author_name: name,
        rating,
        content: review,
        approved: true,
        verified_purchase: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting review:', error);
      return NextResponse.json(
        { error: 'Failed to submit review' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, review: data });
  } catch (error) {
    console.error('Error in reviews API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const watchId = searchParams.get('watch_id');

    let query = supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (watchId) {
      query = query.eq('watch_id', watchId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    // Map database columns to expected format
    const reviews = (data || []).map(r => ({
      id: r.id,
      watch_id: r.watch_id,
      name: r.author_name || r.name,
      rating: r.rating,
      review: r.content || r.review,
      title: r.title,
      verified_purchase: r.verified_purchase,
      created_at: r.created_at
    }));

    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
