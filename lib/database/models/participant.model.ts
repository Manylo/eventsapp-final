// lib/database/model/participant.model.ts
import { Schema } from "mongoose";
import User from './user.model';

const ParticipantSchema = new Schema({
  // Any specific fields for Participant, if needed
});

const Participant = User.discriminator('Participant', ParticipantSchema);

export default Participant;