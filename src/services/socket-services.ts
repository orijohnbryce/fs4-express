import { Server } from "http";
import { Server as SocketServer, Socket } from "socket.io";

export default function handleSocketIo(httpSever: Server) {

    const options = { cors: { origin: "*" } };
    const socketServer = new SocketServer(httpSever, options)

    socketServer.on("connection", (socket: Socket)=>{
        console.log("New WS connection");

        socket.on("new-msg", (msg: string)=>{
            console.log("New message to WS: " + msg);
            
            socket.emit("server-msg", "This is cool response " + String(Math.random()));
        })
        socket.on("smile", (msg: string)=>{                        
            socket.emit("server-msg", "😎");
        })
        
        socket.on("disconnect", ()=>{
            console.log("Client disconnect");            
        })
    })


}