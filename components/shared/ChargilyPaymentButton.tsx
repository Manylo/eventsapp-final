import React, { useState } from "react";
import { IEvent } from "@/lib/database/models/event.model";
import { useRouter } from "next/navigation";
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
      onClick={async () => {
        setIsLoading(true);
        const price = parseInt(event.price);
        const response = await pay({
          userId,
          event_id: event._id.toString(), // S'assurer que c'est une chaîne de caractères
          product_name: event.title,
          product_price: price,
        });
        console.log(response)
        setIsLoading(false);
      }}
    >
      {isLoading ? "loading..." : "pay now"}
    </button>
  );
};

export default ChargilyPaymentButton;
