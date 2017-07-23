import React, { Component } from 'react';

class Canvas extends Component {
  state = {
    lastLength: 0,
  };

  componentDidMount() {
    const canvas = this.node;

    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this.ctx = canvas.getContext('2d');
  }

  componentWillReceiveProps (nextProps) {
    //todo: find a better way to see if a coordinate has been applied
    if (nextProps.lines && nextProps.lines.length > this.state.lastLength) {
      for (let i = this.state.lastLength; i < nextProps.lines.length; i += 1) {
        // console.log('looping through lines ', i);
        const l = nextProps.lines[i];
        this.draw(l.from.x, l.from.y, l.to.x, l.to.y);
      }

      this.update();

      this.setState({
        lastLength: nextProps.lines.length,
      });
    }
  }

  update() {
    this.ctx.stroke();
  }

  draw(lX, lY, cX, cY) {
    this.ctx.strokeStyle = this.props.brushColor;
    this.ctx.lineWidth = this.props.lineWidth;
    this.ctx.moveTo(lX, lY);
    this.ctx.lineTo(cX, cY);
  }

  handleOnMouseDown = (e) => {
    if (!this.props.drawingEnabled) {
      return;
    }

    const rect = this.node.getBoundingClientRect();
    this.ctx.beginPath();

    this.lastX = e.clientX - rect.left;
    this.lastY = e.clientY - rect.top;
    this.drawing = true;
  }

  handleOnMouseMove = (e) => {
    if (this.drawing) {
      const rect = this.node.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      this.draw(this.lastX, this.lastY, currentX, currentY);
      this.update();

      if (this.props.onDraw) {
        this.props.onDraw({
          from: {
            x: this.lastX,
            y: this.lastY,
          },
          to: {
            x: currentX,
            y: currentY,
          },
          brushColor: this.props.brushColor,
          linewidth: this.props.lineWidth,
        });
      }

      this.lastX = currentX;
      this.lastY = currentY;

    }
  }

  handleonMouseUp = () => {
    this.drawing = false;
  }

  render() {
    return (
      <canvas
        ref={node => (this.node = node)}
        style={this.props.canvasStyle}
        onMouseDown={this.handleOnMouseDown}
        onTouchStart={this.handleOnMouseDown}
        onMouseMove={this.handleOnMouseMove}
        onTouchMove={this.handleOnMouseMove}
        onMouseUp={this.handleonMouseUp}
        onTouchEnd={this.handleonMouseUp}
      />
    );
  }
}

Canvas.defaultProps = {
  brushColor: '#000000',
  lineWidth: 2,
  canvasStyle: {
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
  },
  drawingEnabled: false,
  lines: [],
};

export default Canvas;
