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
    console.log(req.body);
    const { level } = req.body;
    let message = level === "HIGH" ? "Water level is HIGH!" : "Water level is LOW!";

    if(level === "HIGH"){
        message = "Water level is HIGH!";
    }else if(level === "LOW"){
        message = "Water level is LOW!";
    }else{
        message = "Water level is NORMAL.";
    }

    const data = {
        level : level,
        message :message,
    }
    io.emit("waterLevelUpdate", data);
    io.emit("debug",req.body);
    res.send({ status: "success", message });
});

io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Server running on port ${port}`));
