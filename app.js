const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();

const PORT = 3400;
const client = process.env.CLIENT || "http://localhost:5173";
const app = express();
const server = http.createServer(app);

// SocketIO
const io = new Server(server, {
    cors: {
        origin: client,
        methods: ["GET", "POST"]
    }
});


const chats = [];
io.on("connection", (socket) => {
    console.log("New Connection");

    socket.on("rendered", () => {
        io.emit("createChat", chats);
    })

    socket.on("sendChat", (data) => {
        chats.push(data);
        io.emit("createChat", chats);
    });
});


// ExpressJS
app.use(cors({
    origin: client
}));

app.get("/", (req, res) => {
    res.status(200).send("Server is Active");
});

server.listen(PORT, () => {
    console.log(`Server is Listening at Port: ${PORT}`);
});