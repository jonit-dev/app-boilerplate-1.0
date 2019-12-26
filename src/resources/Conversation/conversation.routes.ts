import { Router } from 'express';

import { userAuthMiddleware } from '../../middlewares/auth.middleware';
import { LanguageHelper } from '../../utils/LanguageHelper';
import { User } from '../User/user.model';
import { Conversation } from './conversation.model';

// @ts-ignore
const conversationRouter = new Router();

// Get user's conversations ========================================

conversationRouter.get('/conversations', userAuthMiddleware, async (req, res) => {

  const { user } = req;

  const userConversations = await Conversation.find({ senderId: user._id })

  return res.status(200).send(userConversations)


})

// create a new conversation ========================================

conversationRouter.post('/conversations', userAuthMiddleware, async (req, res) => {

  const { user } = req;

  const { receiverId } = req.body;


  try {

    const receiverUser: any = await User.findOne({
      _id: receiverId
    })

    const newConversation = new Conversation({
      title: receiverUser.name,
      subtitle: receiverUser.type,
      avatarUrl: receiverUser.avatarUrl,
      receiverId,
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