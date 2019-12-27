$(function() {
  console.log("Initializing socket.io...");
  const socket = io(); //open websocket connection to our server

  const name = prompt("Whats your name?", "John");

  const room = prompt("Whats your room?", "Abracadabra");

  //first thing, lets join our room
  socket.emit("join", { name, room });

  socket.on("countUpdated", ({ usersConnected }) => {
    console.log(`Total users connected: ${usersConnected}`);
  });

  socket.on("message", ({ name, message }) => {
    //render message in our screen
    $("#messages").append(`<p><strong>${name}:</strong>${message}</p>`);
  });

  $("#chatForm").on("submit", e => {
    e.preventDefault();

    const message = $("#m").val();

    console.log("sending message..");
    console.log(message);
    socket.emit("message", { name, message, room }, callbackMsg => {
      // event acknowledgement (making sure the server received it!)
      // remember that the function that receives it should have a callback argument
      console.log(callbackMsg);

      if (callbackMsg.includes("Clean")) {
        //profanity detected!
        alert(callbackMsg);
      }
    });

    //clean input field
    $("#m").val("");
  });
});
