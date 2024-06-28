import React, { useState } from "react";
import { IEvent } from "@/lib/database/models/event.model";
import { useChargily } from "@/app/api/hooks/use-chargily";

interface CheckoutProps {
  event: IEvent;
  userId: string;
}

const ChargilyPaymentButton: React.FC<CheckoutProps> = ({ event, userId }) => {
  const { pay } = useChargily();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <button
      className="px-6 py-2 bg-[#705CF7] text-white rounded-full hover:bg-[#5a4ac0] focus:outline-none focus:ring-2 focus:ring-[#705CF7] focus:ring-opacity-50"
      onClick={async () => {
        setIsLoading(true);
        const price = parseInt(event.price);
        const response = await pay({
          userId,
          event_id: event._id.toString(), // S'assurer que c'est une chaîne de caractères
          product_name: event.title,
          product_price: price,
        });
        console.log(response);
        setIsLoading(false);
      }}
    >
      {isLoading ? "Loading..." : "Pay Now"}
    </button>
  );
};

export default ChargilyPaymentButton;
