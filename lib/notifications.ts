// lib/notifications.ts
import { sendEmail } from './email';
import { IEvent } from './database/models/event.model';
import { IUser } from './database/models/user.model';

export async function sendEventConfirmationEmail(user: IUser, event: IEvent) {
  const subject = `Inscription réussie à l'événement ${event.title}`;
  const timeRemaining = Math.round((new Date(event.startDateTime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)); // Temps restant en jours

  const html = `
    <h1>Bonjour ${user.firstName},</h1>
    <p>Votre inscription à l'événement <strong>${event.title}</strong> a été réussie.</p>
    <p>Détails de l'événement:</p>
    <ul>
      <li><strong>Titre:</strong> ${event.title}</li>
      <li><strong>Description:</strong> ${event.description}</li>
      <li><strong>Lieu:</strong> ${event.location}</li>
      <li><strong>Date de début:</strong> ${event.startDateTime}</li>
      <li><strong>Date de fin:</strong> ${event.endDateTime}</li>
      <li><strong>Temps restant:</strong> ${timeRemaining} jours</li>
    </ul>
    <p>Nous avons hâte de vous voir à l'événement!</p>
  `;

  await sendEmail(user.email, subject, html);
}
