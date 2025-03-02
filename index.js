const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/hello",(req,res)=>{
        res.send("hello there");
})

app.post("/update-water-level", (req, res) => {
    const { level } = req.body;
    const message = level === "HIGH" ? "Water level is HIGH!" : "Water level is LOW!";
    io.emit("waterLevelUpdate", message);
    res.send({ status: "success", message });
});

io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Server running on port ${port}`));
