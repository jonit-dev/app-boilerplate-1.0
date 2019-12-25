
export class SocketIOHelper {
  public static initialize(io) {

    io.on('connection', (socket) => {
      console.log('User connected');



      socket.on('join', ({ room }) => {
        console.log(`new user joined the room ${room}`);
        socket.join(room)
      })

      socket.on('serverMessage', ({ name, id, message, room }) => {

        console.log(`Received message from ${name} - ${id}: ${message}`);
        console.log(`Redirecting message to room ${room}`);

        io.to(room).emit('clientMessage', { name, id, message })

      })


      // socket.emit would emit just for a specific connection instead
      socket.on('disconnect', () => {
        console.log('User disconnected!');
      })
    })
  }

}