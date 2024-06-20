// lib/database/model/organizer.model.ts
import { Schema } from "mongoose";
import User from './user.model';

const OrganizerSchema = new Schema({
  biography: { type: String, required: true },
});

const Organizer = User.discriminator('Organizer', OrganizerSchema);

export default Organizer;