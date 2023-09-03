import { BaseScene } from "../BaseScene";

export class HomeScene extends BaseScene {
  constructor(
    canvas: HTMLCanvasElement | null
  ) {
    super(canvas)
  }

  drawStartText() {
    if (this.ctx) {
      this.ctx.font = "48px megapixel";
      this.ctx.fillStyle = "#fff";
      this.ctx.textBaseline = "top";
      this.ctx.textAlign = "center";
      this.ctx.fillText("Press F for start", 680, 500);
      // TODO think about animated text (like blinking animation)
    }
  }

  draw() {
    this.imgBg.onload = () => {
      this.drawBg()
      this.drawTitle()
      this.drawStartText()
    };
  }

  update() {
    this.drawBg()
    this.drawTitle()
    this.drawStartText()
  }

  init() { }

  exit() { }
}
