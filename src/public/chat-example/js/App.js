$(function() {
  console.log("Initializing socket.io...");
  const socket = io(); //open websocket connection to our server

  const name = "CHAT TESTER";
  const senderId = "5e02ada53da26e002c4ee2c5";
  const conversationId = "5e053b4430c04f01c8867912";
  const room = conversationId;

  //first thing, lets join our room
  socket.emit("join", { room });

  socket.on("clientMessage", ({ name, senderId, text }) => {
    //render message in our screen
    $("#messages").append(`<p><strong>${name}:</strong>${text}</p>`);
  });

  $("#chatForm").on("submit", e => {
    e.preventDefault();

    const message = $("#m").val();

    console.log("sending message..");
    console.log(message);
    socket.emit(
      "serverMessage",
      {
        name,
        conversationId,
        senderId,
        text: message,
        room
      },
      callbackMsg => {
        // event acknowledgement (making sure the server received it!)
        // remember that the function that receives it should have a callback argument
        console.log(callbackMsg);

        if (callbackMsg.includes("Clean")) {
          //profanity detected!
          alert(callbackMsg);
        }
      }
    );

    //clean input field
    $("#m").val("");
  });
});
