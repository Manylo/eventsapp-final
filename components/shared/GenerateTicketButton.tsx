"use client";

import React from 'react';

type GenerateTicketButtonProps = {
  eventId: string;
  userId: string;
  eventTitle: string;
};

const GenerateTicketButton = ({ eventId, userId, eventTitle }: GenerateTicketButtonProps) => {
  const handleGenerateTicket = async () => {
    const response = await fetch(`/api/generate-ticket?eventId=${eventId}&userId=${userId}`);
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${eventTitle}-ticket.pdf`;
      a.click();
    } else {
      console.error('Failed to generate ticket');
    }
  };

  return (
    <button onClick={handleGenerateTicket} className="mt-4 button bg-blue-500 text-white rounded-md p-2">
      Generate Ticket
    </button>
  );
};

export default GenerateTicketButton;
