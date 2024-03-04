import React from 'react';
import io from 'socket.io-client';
import "./style.css"


class ShapesBoard extends React.Component {
  timeout;
  socket = io.connect("http://localhost:5000");

  ctx;
  isDrawing = false;
  isShapeMode = false; // Flag to enable shape drawing mode
  startMousePosition = { x: 0, y: 0 };
  mouse = { x: 0, y: 0 }; // Declare the mouse variable at the class level

  constructor(props) {
    super(props);

    this.socket.on("canvas-data", (data) => {
      var root = this;
      var interval = setInterval(function () {
        if (root.isDrawing) return;
        root.isDrawing = true;
        clearInterval(interval);
        var image = new Image();
        var canvas = document.querySelector('#board');
        var ctx = canvas.getContext('2d');
        image.onload = function () {
          ctx.drawImage(image, 0, 0);
          root.isDrawing = false;
        };
        image.src = data;
      }, 200)
    });
  }

  componentDidMount() {
    this.drawOnCanvas();
  }

  componentWillReceiveProps(newProps) {
    this.ctx.strokeStyle = newProps.color;
    this.ctx.lineWidth = newProps.size;
  }

  handleShapeButtonClick = () => {
    this.isShapeMode = true;
  }

  handleFreehandButtonClick = () => {
    this.isShapeMode = false;
  }

  drawOnCanvas() {
    var canvas = document.querySelector('#board');
    this.ctx = canvas.getContext('2d');
    var ctx = this.ctx;

    var sketch = document.querySelector('#sketch');
    var sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue('width'));
    canvas.height = parseInt(sketch_style.getPropertyValue('height'));

    /* Mouse Capturing Work */
    canvas.addEventListener('mousemove', (e) => {
      this.mouse.x = e.pageX - canvas.offsetLeft;
      this.mouse.y = e.pageY - canvas.offsetTop;
    }, false);

    /* Drawing on Paint App */
    ctx.lineWidth = this.props.size;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = this.props.color;

    canvas.addEventListener('mousedown', (e) => {
      if (this.isShapeMode) {
        this.startMousePosition.x = e.pageX - canvas.offsetLeft;
        this.startMousePosition.y = e.pageY - canvas.offsetTop;
      } else {
        canvas.addEventListener('mousemove', this.onPaint, false);
      }
    }, false);

    canvas.addEventListener('mousedown', (e) => {
        if (this.isShapeMode) {
          this.startMousePosition.x = e.pageX - canvas.offsetLeft;
          this.startMousePosition.y = e.pageY - canvas.offsetTop;
        } else {
          canvas.addEventListener('mousemove', this.onPaint, false);
        }
      }, false);
  
      canvas.addEventListener('mouseup', () => {
        if (!this.isShapeMode) {
          canvas.removeEventListener('mousemove', this.onPaint, false);
        } else {
          if (this.isShapeMode) {
            this.drawShape(this.startMousePosition, { x: this.mouse.x, y: this.mouse.y });
            this.isShapeMode = false; // Reset shape drawing mode after creating one shape
  
            // Emit the shape data to other users
            var base64ImageData = canvas.toDataURL("image/png");
            this.socket.emit("canvas-data", base64ImageData);
          }
        }
      }, false);
    }
  
    drawShape(start, end) {
        const { ctx } = this;
        const width = end.x - start.x;
        const height = end.y - start.y;
        ctx.beginPath();
        if (this.props.shapeType === 'rectangle') {
          ctx.rect(start.x, start.y, width, height);
        } else if (this.props.shapeType === 'circle') {
          const radius = Math.sqrt(width * width + height * height) / 2;
          const centerX = (start.x + end.x) / 2;
          const centerY = (start.y + end.y) / 2;
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        } else if (this.props.shapeType === 'triangle') {
          const x1 = start.x + width / 2;
          const y1 = start.y;
          const x2 = start.x;
          const y2 = start.y + height;
          const x3 = start.x + width;
          const y3 = start.y + height;
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineTo(x3, y3);
          ctx.closePath();
        } else if (this.props.shapeType === 'line') {
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
          }else if (this.props.shapeType === 'heart') {
      // Draw the heart shape
      const topCurveHeight = height * 0.3;
      ctx.moveTo(start.x, start.y + topCurveHeight);
      ctx.bezierCurveTo(
        start.x, start.y, 
        start.x - width / 2, start.y, 
        start.x - width / 2, start.y + topCurveHeight
      );
      ctx.bezierCurveTo(
        start.x - width / 2, start.y + (height + topCurveHeight) / 2, 
        start.x, start.y + height, 
        start.x, start.y + height
      );
      ctx.bezierCurveTo(
        start.x, start.y + height, 
        start.x + width / 2, start.y + (height + topCurveHeight) / 2, 
        start.x, start.y + topCurveHeight
      );
    }
    ctx.closePath();
        ctx.stroke();
      }

  render() {
    return (
      <div id="sketch">
        <div>
          <button onClick={() => this.handleShapeButtonClick('circle')}>New Shape</button>
        </div>
        <canvas className="board" id="board"></canvas>
      </div>
    )
  }
}


export default ShapesBoard;
