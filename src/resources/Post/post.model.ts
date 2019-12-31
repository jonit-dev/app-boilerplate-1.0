import mongoose from 'mongoose';

export enum PostCategory {
  Default = 'Default'
}

const PostSchema = new mongoose.Schema({
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
    default: PostCategory.Default
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

export const Post = mongoose.model('Post', PostSchema)
