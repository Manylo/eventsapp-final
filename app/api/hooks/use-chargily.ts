"use client";

import {
  create_checkout,
  create_price,
  create_product,
} from "@/lib/actions/chargily-actions";
import { useRouter } from "next/navigation";

interface Product_details {
  userId: string;
  event_id: string; // Modifier ici pour accepter les chaînes de caractères
  product_name: string;
  product_price: number;
}

export const useChargily = () => {
  const router = useRouter();

  const pay = async ({ userId, event_id, product_name, product_price }: Product_details) => {
    try {
      const product = await create_product({ product_name });

      if (!product) throw new Error("failed to create a product");
      if (product){
        console.log(product)
      }
      const price = await create_price({
        amount: product_price,
        product_id: product.id,
      });

      console.log(price);

      if (!price) throw new Error("failed to create a price");

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, eventId: event_id, totalAmount: product_price }),
      };

      const response = await fetch(`http://localhost:3000/api/chargily/create-payment`, options)

      const checkout = await create_checkout({
        price_id: price.id,
        success_url: "http://localhost:3000/",
      });

      if (!checkout?.checkout_url)
        throw new Error("failed to create a checkout");

      router.push(checkout.checkout_url);
    } catch (err) {
      console.error(err);
    }
  };

  return { pay };
};