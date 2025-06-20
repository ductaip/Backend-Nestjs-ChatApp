import { Schema, model, connect } from 'mongoose';

enum MessageStatus {
  Sending = 'sending',
  Sent = 'sent',
  Received = 'received',
  Seen = 'seen',
}

// 1. Create a Schema corresponding to the document interface.
export const BaseMessageSchema = new Schema(
  {
    _id: { type: Number, required: true },
    sender: {
      sender_name: { type: String, require: true },
      sender_id: { type: Number, require: true },
    },
    status: {
      type: String,
      enum: Object.values(MessageStatus),
      default: MessageStatus.Sent,
      require: true,
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
  },
);

const TextMessageSchema = new Schema({
  content: { type: String, require: true },
});

const FileMessageSchema = new Schema({
  url: { type: String, require: true },
  size: { type: Number, require: true },
  extension: { type: String, require: true },
});

const AudioMessageSchema = new Schema({
  url: { type: String, require: true },
  long: { type: Number, require: true },
  size: { type: Number, require: true },
  extension: { type: String, require: true },
});

const ImageMessageSchema = new Schema({
  url: { type: String, require: true },
  width: { type: Number, require: true },
  height: { type: Number, require: true },
  size: { type: Number, require: true },
  extension: { type: String, require: true },
});

const SystemMessageSchema = new Schema({
  content: { type: String, require: true },
});

const CallMessageSchema = new Schema({
  type: {
    type: String,
    enum: ['voice', 'video'],
    require: true,
  },
  duration: {
    type: Number,
    require: true,
  },
});

export const TextMessage = BaseMessageSchema.discriminator(
  'text',
  TextMessageSchema,
);
export const FileMessage = BaseMessageSchema.discriminator(
  'file',
  FileMessageSchema,
);
export const AudioMessage = BaseMessageSchema.discriminator(
  'audio',
  AudioMessageSchema,
);
export const ImageMessage = BaseMessageSchema.discriminator(
  'image',
  ImageMessageSchema,
);
export const SystemMessage = BaseMessageSchema.discriminator(
  'system',
  SystemMessageSchema,
);
export const CallMessage = BaseMessageSchema.discriminator(
  'system',
  CallMessageSchema,
);
