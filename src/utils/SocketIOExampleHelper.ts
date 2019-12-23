import Filter from 'bad-words';


export class SocketIOExampleHelper {

  public static initialize(io) {

    let usersConnected = 0;

    io.on('connection', (socket) => {
      usersConnected++;
      console.log(`New user connected. Total connections: ${usersConnected}`);

      // emit to everyone
      io.emit('countUpdated', {
        usersConnected
      });
      // broadcast emits messages to everyone, except the current socket
      // socket.broadcast.emit('message', {
      //   name: 'Server',
      //   message: 'A new user has joined'
      // })


      // socket.emit would emit just for a specific connection instead
      socket.on('disconnect', () => {
        console.log('User disconnected!');
        usersConnected--;
        console.log(`Total connected users: ${usersConnected}`);

        // broadcast emits messages to everyone, except the current socket
        io.emit('message', {
          name: 'Server',
          message: 'An user has left the room!'
        })


      })

      // Room joining
      socket.on('join', ({ name, room }) => {
        socket.join(room);
        socket.broadcast.to(room).emit('message', {
          name,
          message: `${name} has joined the room ${room}`
        })
      })

      socket.on('message', ({ name, message, room }, callback) => {

        const filter = new Filter()

        if (filter.isProfane(message)) {
          return callback('Clean your mouth!')
        }

        console.log(`Received message from ${name}!`);
        console.log(message);
        // emit it to everyone
        io.to(room).emit('message', { name, message })
        callback('Event was received by the server');
      })


    })
  }



}