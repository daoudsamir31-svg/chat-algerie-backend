const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

require('dotenv').config();

const User = require('./models/User');
const Message = require('./models/Message');
const Block = require('./models/Block');

const pool = require('./config/database');


const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


// Auth Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


// Chat Routes
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);



app.get('/', (req,res)=>{

    res.send(
        'Chat Algerie API is running!'
    );

});



// HTTP Server
const server = http.createServer(app);



// Socket.IO
const io = new Server(server,{

    cors:{
        origin:"*"
    }

});



// Online users
const onlineUsers = new Map();



io.on("connection",(socket)=>{


    console.log(
        "🟢 Socket connected:",
        socket.id
    );



    // User online
    socket.on("user_online", async(user_id)=>{


        try{


            onlineUsers.set(
                user_id,
                socket.id
            );


            await pool.query(
                `
                INSERT INTO user_status
                (user_id,socket_id,online)

                VALUES($1,$2,true)

                ON CONFLICT(user_id)

                DO UPDATE SET

                socket_id=$2,
                online=true,
                last_seen=CURRENT_TIMESTAMP
                `,
                [
                    user_id,
                    socket.id
                ]
            );



            console.log(
                "🟢 User online:",
                user_id
            );



        }catch(error){

            console.log(
                "Online error:",
                error.message
            );

        }


    });





    // Join room
    socket.on("join_room",(room_id)=>{


        socket.join(
            `room_${room_id}`
        );


        console.log(
            "Joined room:",
            room_id
        );


    });







    // Public message
    socket.on("send_room_message",async(data)=>{


        try{


            const saved =
            await Message.create({

                user_id:data.user_id,

                room_id:data.room_id,

                content:data.content

            });



            io.to(
                `room_${data.room_id}`
            )
            .emit(
                "receive_message",
                saved
            );



        }catch(error){

            console.log(
                "Message error:",
                error.message
            );

        }


    });







    // Private message
    socket.on("send_private_message",
    async(data)=>{


        try{


            const blocked =
            await Block.isBlocked(
                data.sender_id,
                data.receiver_id
            );



            if(blocked){


                socket.emit(
                    "blocked",
                    {
                        message:
                        "لا يمكن إرسال الرسالة"
                    }
                );


                return;

            }





            const saved =
            await Message.create({

                user_id:data.sender_id,

                receiver_id:data.receiver_id,

                content:data.content

            });





            const receiverSocket =
            onlineUsers.get(
                data.receiver_id
            );



            if(receiverSocket){


                io.to(receiverSocket)
                .emit(
                    "receive_private_message",
                    saved
                );


            }



        }catch(error){

            console.log(
                "Private message error:",
                error.message
            );


        }



    });








    // Disconnect

    socket.on("disconnect",async()=>{


        try{


            await pool.query(
                `
                UPDATE user_status

                SET online=false,
                last_seen=CURRENT_TIMESTAMP

                WHERE socket_id=$1
                `,
                [
                    socket.id
                ]
            );



            console.log(
                "🔴 Disconnected:",
                socket.id
            );



        }catch(error){

            console.log(error.message);

        }



    });



});






// Start Server

server.listen(PORT,async()=>{


    console.log(
        `🚀 Server running on http://localhost:${PORT}`
    );



    try{


        await User.createTable();


        console.log(
            "✅ Database connected successfully"
        );



    }catch(error){


        console.log(
            "❌ Database error:",
            error.message
        );


    }


});