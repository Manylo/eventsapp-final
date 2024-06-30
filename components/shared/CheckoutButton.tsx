"use client";

import { IEvent } from "@/lib/database/models/event.model";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import ChargilyPaymentButton from "./ChargilyPaymentButton"; // Assurez-vous que le chemin est correct

type CheckoutButtonProps = {
  event: IEvent;
  role?: any; // New prop added here
};

const CheckoutButton = ({ event, role }: CheckoutButtonProps) => {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const hasEventFinished = new Date(event.endDateTime) < new Date();

  return (
    <div className="flex items-center gap-3">
      {hasEventFinished ? (
        <p className="p-2 text-red-400">
          Sorry, tickets are no longer available.
        </p>
      ) : (
        <>
          <SignedOut>
            <Button asChild className="button rounded-full" size="lg">
              <Link href="/sign-in">Get Tickets</Link>
            </Button>
          </SignedOut>
          { role === "participant" && (
            <SignedIn>
              <ChargilyPaymentButton event={event} userId={userId} />{" "}
              {/* Passer les bonnes propriétés */}
            </SignedIn>
          )}
        </>
      )}
    </div>
  );
};

export default CheckoutButton;