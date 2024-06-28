import Order, { IOrder } from '@/lib/database/models/order.model';
import mongoose, { Schema } from "mongoose";

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
      .populate('eventId')
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
    //const query = { eventId, 'buyer.name': { $regex: searchString, $options: 'i' } };
    const orders = await Order.find()
      .skip(skipAmount)
      .limit(limit)
      .populate('eventId')
      .exec();
    const totalOrders = await Order.countDocuments();
    return {
      data: orders,
      totalPages: Math.ceil(totalOrders / limit),
    };
  } catch (error) {
    console.error('Error fetching orders by event:', error);
    throw new Error('Fetching orders by event failed');
  }
}