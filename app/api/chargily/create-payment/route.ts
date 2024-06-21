import { NextRequest, NextResponse } from 'next/server';

const CHARGILY_SECRET_KEY = process.env.CHARGILY_SECRET_KEY;
const CHARGILY_API_URL = process.env.CHARGILY_API_URL;

if (!CHARGILY_SECRET_KEY) {
  console.error('CHARGILY_SECRET_KEY is missing from environment variables');
  throw new Error('Veuillez ajouter CHARGILY_SECRET_KEY à votre fichier .env.local');
}

if (!CHARGILY_API_URL) {
  console.error('CHARGILY_API_URL is missing from environment variables');
  throw new Error('Veuillez ajouter CHARGILY_API_URL à votre fichier .env.local');
}

console.log('CHARGILY_API_URL:', CHARGILY_API_URL); // Log l'URL pour vérifier

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    amount,
    currency,
    client,
    client_email,
    client_phone_number,
    client_address,
    mode,
    webhook_url,
    back_url,
    success_url,
    discount
  } = body;

  if (
    !amount ||
    !currency ||
    !client ||
    !client_email ||
    !client_phone_number ||
    !client_address ||
    !mode ||
    !webhook_url ||
    !back_url ||
    !success_url ||
    discount === undefined
  ) {
    return NextResponse.json({ message: 'Paramètres manquants' }, { status: 400 });
  }

  const paymentData = {
    amount,
    currency,
    client,
    client_email,
    client_phone_number,
    client_address,
    mode,
    discount,
    back_url,
    webhook_url,
    success_url
  };

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CHARGILY_SECRET_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paymentData)
  };

  try {
    const response = await fetch(CHARGILY_API_URL as string, options);
    const data = await response.json();

    if (!response.ok) {
      console.error('Erreur lors de la création du paiement:', data);
      throw new Error(data.message || 'Une erreur est survenue');
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erreur lors de la création du paiement:', error.message);
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      console.error('Erreur inconnue:', error);
      return NextResponse.json({ message: 'Une erreur inconnue est survenue' }, { status: 500 });
    }
  }
}