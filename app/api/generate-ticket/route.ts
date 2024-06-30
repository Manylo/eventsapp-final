import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import Event from '@/lib/database/models/event.model';
import User from '@/lib/database/models/user.model';
import { generateTicket } from '@/lib/generateTicket';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');
  const userId = searchParams.get('userId');

  if (!eventId || !userId) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  await connectToDatabase();

  const event = await Event.findById(eventId).populate('organizer');
  const user = await User.findById(userId);

  if (!event || !user) {
    return NextResponse.json({ error: 'Event or User not found' }, { status: 404 });
  }

  const pdfBytes = await generateTicket(event, user);

  return new NextResponse(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${event.title}-ticket.pdf"`,
    },
  });
}
