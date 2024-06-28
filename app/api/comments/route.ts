// app/api/comments/route.ts
import { NextResponse } from 'next/server';
import { addComment, getCommentsByEvent } from '@/lib/actions/event.actions';

export async function POST(req: Request) {
  try {
    const { eventId, userId, content } = await req.json();
    console.log('Received data:', { eventId, userId, content });

    if (!eventId || !userId || !content) {
      throw new Error('Missing required fields');
    }

    const comment = await addComment(eventId, userId, content);
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    if (!eventId) {
      throw new Error('Event ID is required');
    }
    const comments = await getCommentsByEvent(eventId);
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to get comments' }, { status: 400 });
  }
}

