const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");


socket.on("connect",()=>{

    console.log("CONNECTED:",socket.id);


    console.log("Sending online...");


    socket.emit(
        "user_online",
        1
    );


});


socket.on("disconnect",()=>{

    console.log("Disconnected");

});


setInterval(()=>{

},1000);