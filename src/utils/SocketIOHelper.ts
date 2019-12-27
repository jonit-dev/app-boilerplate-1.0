import { Conversation } from '../resources/Conversation/conversation.model';

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

        console.log(`Received message from ${name} - ${senderId}: ${text}`);
        console.log(`Redirecting message to room ${room}`);

        io.to(room).emit('clientMessage', { name, senderId, text })

      })


      // socket.emit would emit just for a specific connection instead
      socket.on('disconnect', () => {
        console.log('User disconnected!');
      })
    })
  }

}