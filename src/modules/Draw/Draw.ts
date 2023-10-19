// @ts-nocheck
export class Draw {
  #canvas
  #context

  constructor(canvas, ctx) {
    this.#canvas = canvas
    this.#context = ctx
  }

  #fillRect(x, y, width, height) {
    this.#context.fillRect(x, y, width, height)
  }

  #fillStyle(color) {
    this.#context.fillStyle = color
  }

  #clearRect() {
    this.#context.clearRect(0, 0, ...this.#canvas.canvasSize)
  }

  drawStage() {
    this.#fillStyle('black')
    this.#fillRect(0, 0, ...this.#canvas.canvasSize)
  }

  darwFighter(position, size, attackBox) {
    this.#fillStyle('red')
    this.#fillRect(...position, ...size)

    // attakBox
    this.#fillStyle('green')
    this.#fillRect(...attackBox.parames)
  }

  clear() {
    this.#clearRect()
  }
}
