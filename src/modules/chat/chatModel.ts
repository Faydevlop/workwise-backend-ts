import mongoose, { Schema } from 'mongoose';
import { IMessage } from './types/messageTypes';

const MessageSchema: Schema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  seen: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  messageStatus: { type: String, default: 'delivered' },
});

const Message = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
