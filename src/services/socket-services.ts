import { Server } from "http";
import { Server as SocketServer, Socket } from "socket.io";

export default function handleSocketIo(httpSever: Server) {

    const options = { cors: { origin: "*" } };
    const socketServer = new SocketServer(httpSever, options)

    socketServer.on("connection", (socket: Socket)=>{        

        const username = socket.handshake.query.username as string;
        
        socketServer.sockets.emit("server-msg", `${username} Join`)

        socket.on("new-msg", (msg: string)=>{            
            
            // socket.emit("server-msg", "This is cool response " + String(Math.random()));
            socketServer.sockets.emit("server-msg", `${username}: ${msg}`);

            socket.emit("server-msg", "ok");
            
        })
        socket.on("smile", (msg: string)=>{                        
            socket.emit("server-msg", "😎");
        })
        
        socket.on("disconnect", ()=>{
            socketServer.sockets.emit("server-msg", `${username} Left`)
            console.log("Client disconnect");            
        })
    })


}