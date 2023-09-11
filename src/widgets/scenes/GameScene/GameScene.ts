import { arenaList } from "../MainScene/config";

const DEFAULT_BG_URL = "/assets/sprites/arena-1.png"

export class GameScene {
  bgImgUrl: string;
  imgBg: HTMLImageElement;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null | undefined;

  // FIXME get image path from arena state
  constructor(
    canvas: HTMLCanvasElement | null,
    imgUrl = DEFAULT_BG_URL,
  ) {
    this.canvas = canvas
    this.ctx = canvas?.getContext("2d");

    this.bgImgUrl = imgUrl
    this.imgBg = new Image();
    this.imgBg.src = this.bgImgUrl;
  }

  setBgById(idArg: number) {
    const sprite = arenaList.find(({ id }) => id === idArg)!
    this.bgImgUrl = sprite.previewSprite
    this.imgBg = new Image();
    this.imgBg.src = this.bgImgUrl;
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
    };
  }

  update() {
    this.drawBg()
  }

  init() { }

  exit() { }
}
