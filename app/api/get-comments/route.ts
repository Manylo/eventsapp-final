import { NextRequest, NextResponse } from 'next/server';
import Event from '@/lib/database/models/event.model';
import { connectToDatabase } from '@/lib/database';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId');

  if (!eventId) {
    return NextResponse.json({ message: 'Paramètre eventId manquant' }, { status: 400 });
  }

  const event = await Event.findById(eventId).populate('comments.userId', 'firstName lastName');

  if (!event) {
    return NextResponse.json({ message: 'Événement non trouvé' }, { status: 404 });
  }

  return NextResponse.json({ comments: event.comments }, { status: 200 });
}
