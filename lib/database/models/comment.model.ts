import { Schema, model, Document, models } from 'mongoose';

interface Comment extends Document {
  eventId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  username: string;
  content: string;
  createdAt: Date;
}

const commentSchema = new Schema<Comment>({
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const CommentModel = models.Comment || model<Comment>('Comment', commentSchema);

export default CommentModel;
