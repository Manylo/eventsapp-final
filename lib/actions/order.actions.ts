import Order, { IOrder } from '@/lib/database/models/order.model';
import mongoose, { Schema } from "mongoose";
import { sendEventConfirmationEmail } from '@/lib/notifications'; // Importer la fonction de notification
import { getUserById } from './user.actions'; // Assurez-vous que cette fonction existe
import { getEventById } from './event.actions'; // Assurez-vous que cette fonction existe


interface CreateOrderParams {
  eventId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  totalAmount: number;
  createdAt: Date;
}

interface GetOrdersByUserParams {
  userId: mongoose.Types.ObjectId;
  page?: number;
  limit?: number;
}

interface GetOrdersByEventParams {
  eventId: mongoose.Types.ObjectId;
  searchString?: string;
  page?: number;
  limit?: number;
}

export async function createOrder({ eventId, userId, totalAmount, createdAt }: CreateOrderParams): Promise<IOrder> {
  try {
    const newOrder = await Order.create({
      eventId,
      userId,
      totalAmount,
      createdAt,
    });

    const event = await getEventById(eventId.toString()); // Charger les détails de l'événement
    const user = await getUserById(userId.toString()); // Charger les détails de l'utilisateur

    // Envoyer l'e-mail de confirmation
    await sendEventConfirmationEmail(user, event);

    return newOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Order creation failed');
  }
}



export async function getOrdersByUser({ userId, page = 1, limit = 10 }: GetOrdersByUserParams): Promise<{ data: IOrder[], totalPages: number }> {
  try {
    const skipAmount = (page - 1) * limit;
    const orders = await Order.find({ userId })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: 'eventId',
        populate: { path: 'organizer', select: 'firstName lastName' } // Populate organizer inside eventId
      })
      .populate('userId', 'username') // Populate userId to get the username
      .exec();
    const totalOrders = await Order.countDocuments({ userId });
    return {
      data: orders,
      totalPages: Math.ceil(totalOrders / limit),
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Fetching orders failed');
  }
}


export async function getOrdersByEvent({ eventId, searchString = '', page = 1, limit = 10 }: GetOrdersByEventParams): Promise<{ data: IOrder[], totalPages: number }> {
  try {
    const skipAmount = (page - 1) * limit;
    const query = { eventId };
    const orders = await Order.find(query)
      .skip(skipAmount)
      .limit(limit)
      .populate('eventId')
      .populate('userId', 'username')  // Populate userId to get the username
      .exec();
    
    // Filtrage après population
    const filteredOrders = orders.filter(order => order.userId && (order.userId as any).username.includes(searchString));
    
    const totalOrders = await Order.countDocuments(query);
    return {
      data: filteredOrders,
      totalPages: Math.ceil(totalOrders / limit),
    };
  } catch (error) {
    console.error('Error fetching orders by event:', error);
    throw new Error('Fetching orders by event failed');
  }
}
