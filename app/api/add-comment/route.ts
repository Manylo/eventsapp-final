import { NextRequest, NextResponse } from 'next/server';
import Event from '@/lib/database/models/event.model';
import { connectToDatabase } from '@/lib/database';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  
  const { userId, userName, comment, eventId } = await req.json();

  if (!userId || !userName || !comment || !eventId) {
    return NextResponse.json({ message: 'Paramètres manquants' }, { status: 400 });
  }

  const event = await Event.findById(eventId);

  if (!event) {
    return NextResponse.json({ message: 'Événement non trouvé' }, { status: 404 });
  }

  event.comments.push({ userId, userName, comment, createdAt: new Date() });

  await event.save();

  return NextResponse.json({ message: 'Commentaire ajouté avec succès' }, { status: 200 });
}
