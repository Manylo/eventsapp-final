import { Document, Schema, model, models } from "mongoose";
import { IEvent } from './event.model'; // Assurez-vous que ce fichier contient l'interface IEvent

export interface IOrder extends Document {
  _id: Schema.Types.ObjectId;
  eventId: IEvent;
  userId: Schema.Types.ObjectId;
  totalAmount: number;
  createdAt: Date;
  buyer: { name: string }; // Assurez-vous que la propriété 'buyer' est définie
}

const OrderSchema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  buyer: {
    name: { type: String, required: true } // Assurez-vous que 'buyer' est défini dans le schéma
  }
});

const Order = models.Order || model<IOrder>('Order', OrderSchema);

export default Order;
