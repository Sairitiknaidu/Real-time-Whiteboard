import React from 'react';
import Board from '../board/Board';
import BoardText from '../boardtext/BoardText';
import ShapesBoard from '../boardshape/ShapesBoard';

import './style.css';

class Container extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            color: "#000000",
            size: "5",
            mode: "paint", // Default mode is "paint"
      text: "",      // To store user input for text
      shapeType: "circle" // Default shape type
        }
    }

    changeColor(params) {
        this.setState({
            color: params.target.value
        })
    }

    changeSize(params) {
        this.setState({
            size: params.target.value
        })
    }

    changeMode(event) {
        this.setState({
          mode: event.target.value,
        });
      }

      changeShapeType = (shapeType) => {
        this.setState({
          shapeType
        });
      };

    render() {

        return (
            <div className="container">
                <div className="tools-section">
                    <div className='modes'>
                    Select Tool : &nbsp; 
                    <select name="modes" id="modes" onChange={this.changeMode.bind(this)}>
  <option value="paint">Paint</option>
  <option value="shape">Shapes</option>
  <option value="type">Chat</option>
</select>
                    </div>
                    <div className="color-picker">
                        Select Color : &nbsp; 
                        <input type="color" value={this.state.color} onChange={this.changeColor.bind(this)}/>
                    </div>

                    <div className="brushsize-container">
                        Select Size : &nbsp; 
                        <select value={this.state.size} onChange={this.changeSize.bind(this)}>
                            <option> 5 </option>
                            <option> 10 </option>
                            <option> 15 </option>
                            <option> 20 </option>
                            <option> 25 </option>
                            <option> 30 </option>
                        </select>
                    </div>
                    <div>
 {this.state.mode === "shape" && (
            <div className="shape-buttons">
                <button onClick={() => this.changeShapeType('line')}>Line</button>
              <button onClick={() => this.changeShapeType('circle')}>Circle</button>
              <button onClick={() => this.changeShapeType('rectangle')}>Rectangle</button>
              <button onClick={() => this.changeShapeType('heart')}>Blob</button>
              <button onClick={() => this.changeShapeType('triangle')}>Triangle</button>
              
            </div>
          )}
        </div>
                </div>

                <div className="board-container">
          {this.state.mode === "paint" ? (
            <Board color={this.state.color} size={this.state.size} />
          ) : this.state.mode === "type" ? (
            <BoardText color={this.state.color} size={this.state.size} />
          ) : (
            <ShapesBoard color={this.state.color} size={this.state.size} shapeType={this.state.shapeType} />
          )}
        </div>
            </div>
        )
    }
}

export default Container