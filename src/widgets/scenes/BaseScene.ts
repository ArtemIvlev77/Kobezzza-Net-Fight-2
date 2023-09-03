const HOME_BG_URL = "/assets/sprites/home-bg.png"

export class BaseScene {
  bgImgUrl: string;
  imgBg: HTMLImageElement;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null | undefined;

  constructor(
    canvas: HTMLCanvasElement | null,
    imgUrl = HOME_BG_URL,
  ) {
    this.canvas = canvas
    this.ctx = canvas?.getContext("2d");

    this.bgImgUrl = imgUrl
    this.imgBg = new Image();
    this.imgBg.src = this.bgImgUrl;
  }

  drawTitle() {
    if (this.ctx) {
      this.ctx.font = "64px megapixel";
      this.ctx.fillStyle = "#fff";
      this.ctx.textBaseline = "top";
      this.ctx.textAlign = "center";
      this.ctx.fillText("FIGHTING", 680, 150);
    }
  }

  drawBg() {
    if (this.canvas && this.bgImgUrl) {
      const hRatio = this.canvas?.width / this.imgBg.width;
      const vRatio = this.canvas?.height / this.imgBg.height;
      const ratio = Math.min(hRatio, vRatio);
      // TODO create helpers for work with draw methods
      // this params order place image by center with suitable sizes
      this.ctx?.drawImage(
        this.imgBg,
        0,
        0,
        this.imgBg.width,
        this.imgBg.height,
        0,
        0,
        this.imgBg.width * ratio,
        this.imgBg.height * ratio
      );
    }
  }

  draw() {
    this.imgBg.onload = () => {
      this.drawBg()
      this.drawTitle()
    };
  }

  update() {
    this.drawBg()
    this.drawTitle()
  }
}
