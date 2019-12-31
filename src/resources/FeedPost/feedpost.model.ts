import mongoose from 'mongoose';

export enum FeedPostCategory {
  Default = 'Default'
}

const feedPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,

  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  ownerId: {
    type: Object,
    required: true
  },
  image: {
    type: Buffer,
    default: null
  },
  category: {
    type: String,
    default: FeedPostCategory.Default
  },
  likes: {
    type: Number,
    default: 0
  },
  usersWhoLiked: [
    {
      type: String
    }
  ]

}, {
  timestamps: true
})

export const FeedPost = mongoose.model('FeedPost', feedPostSchema)
