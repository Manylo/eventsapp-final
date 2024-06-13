import React from 'react';
import { IEvent } from '@/lib/database/models/event.model';

interface CheckoutProps {
  event: IEvent;
  userId: string;
}

const ChargilyPaymentButton: React.FC<CheckoutProps> = ({ event, userId }) => {
  const handleClick = async () => {
    const paymentData = {
      amount: 2000,
      currency: 'dzd',
      client: '', // Nom du client
      client_email: '', // Email du client
      client_phone_number: '', // Numéro de téléphone du client
      client_address: '', // Adresse du client
      mode: '', // Mode de paiement
      webhook_url: 'https://eventdz.free.beeceptor.com', // URL du webhook
      back_url: 'http://localhost:3000/payments/success', // URL de retour
      success_url: 'http://localhost:3000/payments/success', // URL de succès
      discount: 0
    };

    try {
      const response = await fetch('/api/chargily/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      console.log('Payment created:', data);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error creating payment:', error.message);
      } else {
        console.error('Unknown error:', error);
      }
    }
  };

  return <button onClick={handleClick}>Pay Now</button>;
};

export default ChargilyPaymentButton;
