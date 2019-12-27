import mongoose from 'mongoose';

export enum ConversationType {
  Individual = 'Individual',
  Group = 'Group'
}

const conversationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: ConversationType.Individual
    },
    subtitle: {
      type: String
    },
    receiverIds: [ // can be one (if individual) or more (if group)
      {
        receiverId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        }
      }
    ],


    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    avatarUrl: {
      type: String
    },

    messages: [
      { // message
        text: {
          type: String,
        },
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        }
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