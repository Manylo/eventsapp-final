import { NextRequest, NextResponse } from 'next/server';
import Event from '@/lib/database/models/event.model';
import { connectToDatabase } from '@/lib/database';
import { affectRoleUser } from '@/lib/actions/user.actions';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { role,userId } =await req.json();

  if (!role ||!userId) {
    return NextResponse.json({ message: 'Paramètres manquants' }, { status: 400 });
  }

  const result=await affectRoleUser(userId,role);

  return NextResponse.json({ message: 'role affecté avec succés' }, { status: 200 });
}