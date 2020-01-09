import { Router } from 'express';

import { userAuthMiddleware } from '../../middlewares/auth.middleware';
import { LanguageHelper } from '../../utils/LanguageHelper';
import { User } from '../User/user.model';
import { Conversation } from './conversation.model';

// @ts-ignore
const conversationRouter = new Router();

// Get user's conversations or conversation by id ========================================

conversationRouter.get('/conversations', userAuthMiddleware, async (req, res) => {

  const { user } = req;

  const { id } = req.query;


  if (id) {

    // if user specified an Id, its because he wants a particular conversation data (not all)

    try {
      const userConversation = await Conversation.findOne({ _id: id })

      return res.status(200).send(userConversation)

    }
    catch (error) {
      console.error(error);
      return res.status(400).send([])
    }


  }

  // if no id was specified, return all conversations

  const userConversations = await Conversation.find({ senderId: user._id })

  return res.status(200).send(userConversations)


})


// create a new conversation ========================================

conversationRouter.post('/conversations', userAuthMiddleware, async (req, res) => {

  const { user } = req;

  const { receiverId, type } = req.body;

  if (type === "Individual") {

    const conversations: any = await Conversation.find({
      type,
      senderId: user._id
    })


    for (const conversation of conversations) {
      // if we already have a conversation from this user with the same receiver (individual conversation only)
      if (conversation.receiverIds[0].receiverId.equals(receiverId)) {
        console.log('conversation already exists, skipping creation...');
        // in other words, if conversation already exists, return an error
        return res.status(400).send({
          status: 'error',
          message: LanguageHelper.getLanguageString('conversation', 'conversationAlreadyExistsError')
        })
      }
    }





  }





  try {

    const receiverUser: any = await User.findOne({
      _id: receiverId
    })

    const newConversation = new Conversation({
      title: receiverUser.name,
      subtitle: receiverUser.type,
      avatarUrl: receiverUser.avatarUrl,
      receiverIds: [{ receiverId: receiverUser._id }],
      senderId: user._id,
      messages: []
    })

    await newConversation.save();

    return res.status(200).send(newConversation)
  }
  catch (error) {
    console.error(error);
    return res.status(400).send({
      status: 'error',
      message: LanguageHelper.getLanguageString('conversation', 'conversationCreationError'),
      details: error.message
    })
  }
})

// delete conversation ========================================

conversationRouter.delete('/conversations/:id', userAuthMiddleware, async (req, res) => {

  const { user } = req;
  const { id } = req.params

  const conversation: any = await Conversation.findOne({
    _id: id
  })



  if (!conversation) {
    return res.status(404).send({
      status: 'error',
      message: LanguageHelper.getLanguageString('conversation', 'conversationNotFound')
    })
  }

  // check if this user is really the owner of this conversation

  console.log('conversation');

  console.log(conversation.senderId);
  console.log(user._id);
  if (!conversation.senderId.equals(user._id)) {
    return res.status(400).send({
      status: 'error',
      message: LanguageHelper.getLanguageString('conversation', 'conversationDeletionErrorNotOwner')
    })
  }


  try {
    await conversation.remove();

    return res.status(200).send(conversation)


  }
  catch (error) {
    console.error(error);
    return res.status(400).send({
      status: 'error',
      message: LanguageHelper.getLanguageString('conversation', 'conversationDeletionError'),
      details: error.message
    })
  }



})



export { conversationRouter }