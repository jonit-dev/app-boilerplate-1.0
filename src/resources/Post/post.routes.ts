import { Router } from 'express';
import fileType from 'file-type';
import fs from 'fs';

import { userAuthMiddleware } from '../../middlewares/auth.middleware';
import { LanguageHelper } from '../../utils/LanguageHelper';
import { UploadHelper } from '../../utils/UploadHelper';
import { Post } from './post.model';


// @ts-ignore
const postRouter = new Router();

postRouter.get('/post', userAuthMiddleware, async (req, res) => {



  const { id } = req.query;


  if (id) {

    // if user specified an Id, its because he wants a particular post data (not all)

    try {
      const foundPost = await Post.findOne({ _id: id })

      return res.status(200).send(foundPost)

    }
    catch (error) {
      console.error(error);
      return res.status(400).send([])
    }


  }

  // if no id was specified, return all posts

  const post = await Post.find({})

  return res.status(200).send(post)


})

// Like a new post ========================================

postRouter.post('/post/like', userAuthMiddleware, async (req, res) => {

  const { user } = req;

  const { id } = req.body;

  try {

    const post: any = await Post.findOne({ _id: id })

    if (!post) {
      return res.status(401).send({
        status: 'Error',
        message: LanguageHelper.getLanguageString('post', 'postNotFound')
      })
    }

    // check if user didn't like it yet. If so, lets remove a like and remove the users from 'usersWhoLiked' list

    if (post.usersWhoLiked.includes(user._id)) {

      // check if there're likes to reduce

      if (post.likes >= 1) {
        post.likes -= 1;
        post.usersWhoLiked = post.usersWhoLiked.filter((ids) => !user._id.equals(ids))
        await post.save();

      }
      return res.status(200).send(post)
    }


    // if post is found, lets like it



    post.likes += 1;
    post.usersWhoLiked = [
      ...post.usersWhoLiked,
      user._id
    ]
    await post.save()

    return res.status(200).send(post)

  }
  catch (error) {
    console.error(error);

    return res.status(401).send({
      status: 'error',
      message: LanguageHelper.getLanguageString('post', 'postLikeError'),
      details: error.message
    })

  }


})



// Post a new post ========================================



postRouter.post('/post', userAuthMiddleware, async (req, res) => {

  const { user } = req;

  const { title, text, images, category } = req.body;



  try {

    const newPost = new Post({
      title,
      text,
      ownerId: user._id,
      category
    })

    await newPost.save();


    // Save images to database

    const imagesURI = await Promise.all(images.map(async (imageStream) => {

      const data = fs.readFileSync(imageStream.path);
      const buffer = Buffer.from(data)

      const options = {
        maxFileSizeInMb: 15,
        // @ts-ignore
        fileExtension: fileType(buffer).ext,
        allowedFileExtensions: ['png', 'jpg', 'jpeg'],
        resizeWidthHeight: {
          width: null,
          height: 600
        }
      }


      try {
        const uploadOutput = await UploadHelper.saveImageToFolder('post', newPost._id, 'jpg', buffer, options)

        if (uploadOutput === 'unallowedExtension') {
          return res.status(401).send({
            status: 'error',
            message: LanguageHelper.getLanguageString('post', 'postFileTypeError', {
              type: options.fileExtension
            })
          })
        }

        if (uploadOutput === 'maxFileSize') {
          return res.status(401).send({
            status: 'error',
            message: LanguageHelper.getLanguageString('post', 'postFileMaximumSize', {
              size: '15mb'
            })
          })
        }
        return uploadOutput
      }
      catch (error) {
        console.error(error);
        return res.status(401).send({
          status: 'error',
          message: LanguageHelper.getLanguageString('post', 'postFileUploadError')
        })
      }

    }))

    // @ts-ignore
    newPost.images = imagesURI
    await newPost.save()


    return res.status(200).send(newPost)
  }
  catch (error) {
    console.error(error);
    return res.status(400).send({
      status: 'error',
      message: LanguageHelper.getLanguageString('post', 'postCreationError'),
      details: error.message
    })
  }
})

// delete a new post

postRouter.delete('/post/:id', userAuthMiddleware, async (req, res) => {

  const { user } = req;
  const { id } = req.params

  const post: any = await Post.findOne({
    _id: id
  })



  if (!post) {
    return res.status(404).send({
      status: 'error',
      message: LanguageHelper.getLanguageString('post', 'postNotFound')
    })
  }

  // check if this user is really the owner of this post


  if (!post.ownerId.equals(user._id)) {
    return res.status(400).send({
      status: 'error',
      message: LanguageHelper.getLanguageString('post', 'postNotOwner')
    })
  }


  try {
    await post.remove();

    return res.status(200).send(post)


  }
  catch (error) {
    console.error(error);
    return res.status(400).send({
      status: 'error',
      message: LanguageHelper.getLanguageString('post', 'postDeletionError'),
      details: error.message
    })
  }



})


export { postRouter }