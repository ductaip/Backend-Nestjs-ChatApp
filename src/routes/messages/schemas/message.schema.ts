import { Schema } from 'mongoose';

export enum MessageStatus {
  Sending = 'sending',
  Sent = 'sent',
  Received = 'received',
  Seen = 'seen',
}

export const BaseMessageSchema = new Schema(
  {
    _id: { type: Number, required: true },
    sender: {
      sender_name: { type: String, required: true },
      sender_id: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: Object.values(MessageStatus),
      default: MessageStatus.Sent,
      required: true,
    },
    conversation_id: { type: Number, required: true },
    reply_to_id: { type: Number },
    is_deleted: { type: Boolean, default: false },
    sent_at: { type: Date },
    received_at: { type: Date },
    seen_at: { type: Date },
  },
  {
    discriminatorKey: 'type',
    timestamps: true,
    _id: false,
  },
);

export const TextMessageSchema = new Schema({
  content: { type: String, require: true },
});

export const FileMessageSchema = new Schema({
  url: { type: String, require: true },
  size: { type: Number, require: true },
  extension: { type: String, require: true },
});

export const AudioMessageSchema = new Schema({
  url: { type: String, require: true },
  long: { type: Number, require: true },
  size: { type: Number, require: true },
  extension: { type: String, require: true },
});

export const ImageMessageSchema = new Schema({
  url: { type: String, require: true },
  width: { type: Number, require: true },
  height: { type: Number, require: true },
  size: { type: Number, require: true },
  extension: { type: String, require: true },
});

export const SystemMessageSchema = new Schema({
  content: { type: String, require: true },
});

export const CallMessageSchema = new Schema({
  media_type: {
    type: String,
    enum: ['voice', 'video'],
    require: true,
  },
  duration: {
    type: Number,
    require: true,
  },
});
