import React from "react";
import "./style.css"
import io from "socket.io-client";
import { useEffect, useState } from "react";

const BoardText = ({ color, size }) => {
  const socket = io.connect("http://localhost:5000");

  // Canvas State
  const [canvas, setCanvas] = useState(null);
  const [ctx, setCtx] = useState(null);

  // Text input State
  const [text, setText] = useState("Type your text here");
  const [nickname, setNickname] = useState("");

  // Room State
  const [room, setRoom] = useState("");

  // Messages State
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [selectedColor, setSelectedColor] = useState(color);
  const [selectedSize, setSelectedSize] = useState(size);

  useEffect(() => {
    // Update selectedColor and selectedSize whenever color and size props change
    setSelectedColor(color);
    setSelectedSize(size);
  }, [color, size]);

  // Join room function
  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  // Send message function
  const sendMessage = () => {
    socket.emit("send_message", { message, nickname, room });
  };

  // Handle text input change
  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  // Handle nickname input change
  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
  };

  // Draw text on canvas
  const drawTextOnCanvas = () => {
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000000";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.font = "0px sans-serif";

      // Draw each message in reverse order, latest message at the top
      for (let i = messages.length - 1; i >= 0; i--) {
        const { nickname, message } = messages[i];
        ctx.fillText(`${nickname}: ${message}`, canvas.width / 2, (canvas.height / 2) + 20 * (messages.length - 1 - i));
      }
    }
  };

  useEffect(() => {
    setCanvas(document.querySelector("#board"));
  }, []);

  useEffect(() => {
    if (canvas) {
      setCtx(canvas.getContext("2d"));
    }
  }, [canvas]);

  useEffect(() => {
    drawTextOnCanvas();
  }, [ctx, messages]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      // Add the received message to the array of messages
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, [socket]);

  return (
    <div className="Appy">
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}> Join Room</button>
      <input
        placeholder="Nickname..."
        value={nickname}
        onChange={handleNicknameChange}
      />
      <input
        placeholder="Message..."
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}> Send Message</button>
      <h1> Messages:</h1>
      {messages.map((msg, index) => (
        <p style={{
          color: selectedColor, fontSize: `${selectedSize}px`}} key={index}>{`${msg.nickname}: ${msg.message}`}</p>
      ))}
      <canvas id="board" className="board"></canvas>
    </div>
  );
};

export default BoardText;
