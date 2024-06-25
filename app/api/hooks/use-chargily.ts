"use client";

import {
  create_checkout,
  create_price,
  create_product,
} from "@/lib/actions/chargily-actions";
import { ObjectId } from 'mongodb'
import { useRouter } from "next/navigation";

interface Product_details {
  event_id:ObjectId,
  product_name: string;
  product_price: number;
}
export const useChargily = () => {
  // Define a custom hook useChargily that takes product_name and product_price as parameters
  const router = useRouter(); // Using the useRouter hook to get access to Next.js router

  const pay = async ({ userId,event_id,product_name, product_price }: Product_details) => {
    // Define an asynchronous function pay
    try {
      const product = await create_product({ product_name }); // Creating a product with the given product_name

      if (!product) throw new Error("failed to create a product"); // Throw an error if product creation fails
      if (product){
        console.log(product)
      }
      const price = await create_price({
        // Creating a price with the given product_price and the product's id
        amount: product_price,
        product_id: product?.id,
      });
      
      console.log(price);


      if (!price) throw new Error("failed to create a price"); // Throw an error if price creation fails*
      
      
      const options = {
          method: "POST",
          headers: {

            "Content-Type": "application/json",
          },
          body: JSON.stringify({userId, eventId:event_id, totalAmount:product_price}), // Constructing the body with product_name
  };
 

      const response = await fetch(`http://localhost:3000/api/chargily/create-payment`, options)

      const checkout = await create_checkout({
        // Creating a checkout with the created price's id and a success URL
        price_id: price.id,
        success_url: "http://localhost:3000/",
      });

      if (!checkout?.checkout_url)
        // Throw an error if checkout creation fails or if checkout_url is not available
        throw new Error("failed to create a checkout");

      router.push(checkout?.checkout_url); // Redirecting the user to the checkout URL
    } catch (err) {
      console.error(err); // Logging any errors that occur during the process
    }
  };

  return { pay }; // Returning the pay function for external use
};