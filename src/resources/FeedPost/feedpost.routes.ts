import { Router } from 'express';

import { userAuthMiddleware } from '../../middlewares/auth.middleware';
import { LanguageHelper } from '../../utils/LanguageHelper';
import { FeedPost } from './feedpost.model';


// @ts-ignore
const feedPostRouter = new Router();

feedPostRouter.get('/feed-post', userAuthMiddleware, async (req, res) => {



  const { id } = req.query;


  if (id) {

    // if user specified an Id, its because he wants a particular feedpost data (not all)

    try {
      const feedPost = await FeedPost.findOne({ _id: id })

      return res.status(200).send(feedPost)

    }
    catch (error) {
      console.error(error);
      return res.status(400).send([])
    }


  }

  // if no id was specified, return all feed posts

  const feedPost = await FeedPost.find({})

  return res.status(200).send(feedPost)


})

// Like a new feed post ========================================

feedPostRouter.post('/feed-post/like', userAuthMiddleware, async (req, res) => {

  const { user } = req;

  const { id } = req.body;

  try {

    const feedPost: any = await FeedPost.findOne({ _id: id })

    if (!feedPost) {
      return res.status(401).send({
        status: 'Error',
        message: LanguageHelper.getLanguageString('feedpost', 'feedpostNotFound')
      })
    }

    // check if user didn't like it yet. If so, lets remove a like and remove the users from 'usersWhoLiked' list

    if (feedPost.usersWhoLiked.includes(user._id)) {

      // check if there're likes to reduce

      if (feedPost.likes >= 1) {
        feedPost.likes -= 1;
        feedPost.usersWhoLiked = feedPost.usersWhoLiked.filter((ids) => !user._id.equals(ids))
        await feedPost.save();

      }
      return res.status(200).send(feedPost)
    }


    // if post is found, lets like it



    feedPost.likes += 1;
    feedPost.usersWhoLiked = [
      ...feedPost.usersWhoLiked,
      user._id
    ]
    await feedPost.save()

    return res.status(200).send(feedPost)

  }
  catch (error) {
    console.error(error);

    return res.status(401).send({
      status: 'error',
      message: LanguageHelper.getLanguageString('feedpost', 'feedpostLikeError'),
      details: error.message
    })

  }


})



// Post a new feed post ========================================

feedPostRouter.post('/feed-post', userAuthMiddleware, async (req, res) => {

  const { user } = req;

  const { title, text, image, category } = req.body;


  try {

    const newFeedPost = new FeedPost({
      title,
      text,
      ownerId: user._id,
      image,
      category
    })

    await newFeedPost.save();

    return res.status(200).send(newFeedPost)
  }
  catch (error) {
    console.error(error);
    return res.status(400).send({
      status: 'error',
      message: LanguageHelper.getLanguageString('feedPost', 'feedpostCreationError'),
      details: error.message
    })
  }
})


export { feedPostRouter }