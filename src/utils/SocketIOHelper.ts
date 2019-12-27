import { Conversation, ConversationType } from '../resources/Conversation/conversation.model';
import { User } from '../resources/User/user.model';
import { PushNotificationHelper } from './PushNotificationHelper';

export class SocketIOHelper {
  public static initialize(io) {

    io.on('connection', (socket) => {
      console.log('User connected');



      socket.on('join', ({ room }) => {

        console.log(`new user joined the room ${room}`);
        socket.join(room)

      })

      socket.on('serverMessage', async ({ name, conversationId, senderId, text, room }) => {

        console.log(`received message regarding conversationId: ${conversationId}`);

        const conversation: any = await Conversation.findOne({
          _id: conversationId
        })

        const newMessage = {
          text,
          senderId
        }

        // registers message on database

        if (conversation) {

          console.log('saving message to database...');
          conversation.messages = [
            ...conversation.messages,
            newMessage
          ]
          await conversation.save();
        }

        // get sender information (we'll use it on the push message)

        const sender: any = await User.findOne({
          _id: senderId
        })
        if (!sender) {
          console.log('Push notification: sender not found!');
        }

        // Submit push notifications to users who're involved with the conversation (except the sender)

        const filteredReceiverObjs = conversation.receiverIds.filter((receiverObj) => receiverObj.receiverId !== senderId);

        const conversationUsersIds = filteredReceiverObjs.map((obj) => obj.receiverId)

        console.log('Submitting push notifications to the following users...');
        console.log(conversationUsersIds);

        // grab target users push tokens
        let pushTokens: string[] = [];

        for (const userId of conversationUsersIds) {
          const user = await User.findOne({
            _id: userId
          })

          if (user) {
            pushTokens = [
              ...pushTokens,
              user.pushToken
            ]
          } else {
            console.log(`User not found for id ${userId}`);
          }
        }

        let params;

        switch (conversation.type) {
          case ConversationType.Individual:

            // we'll need the receiver info
            const receiver: any = await User.findOne({
              // note that on individual conversations, we only have one receiver!
              _id: conversation.receiverIds[0].receiverId
            })

            params = {
              conversationTitle: receiver.name,
              conversationId,
              conversationImage: receiver.avatarUrl
            }
            break;
          case ConversationType.Group:
            params = {
              conversationTitle: conversation.title,
              conversationId,
              conversationImage: null
            }
            break;

        }


        PushNotificationHelper.sendPush(pushTokens, {
          sound: "default",
          body: `${sender.name}: ${text}`,
          data: {
            toScreen: "IndividualChat",
            params
          }
        })

        console.log(`Received message from ${name} - ${senderId}: ${text}`);
        console.log(`Redirecting message to room ${room}`);

        // Redirect the message to all users on the room
        io.to(room).emit('clientMessage', { name, senderId, text })

      })



      socket.on('disconnect', () => {
        console.log('User disconnected!');
      })
    })
  }

}