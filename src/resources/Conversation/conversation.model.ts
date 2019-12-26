import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    avatarUrl: {
      type: String
    },

    messages: [
      {
        message: {
          type: String,
        },
        default: []
      },
      {
        timestamps: true
      }
    ]
  },
  {
    timestamps: true
  }
)

const Conversation = mongoose.model('Conversation', conversationSchema)

export { Conversation }