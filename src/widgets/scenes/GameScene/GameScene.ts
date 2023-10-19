import { Draw } from "modules/Draw/Draw";
import { Fighter } from "../../../modules/Figter/Fighter";
import { arenaList } from "../MainScene/config";
import { Avatar } from "modules/Figter/Avatar";
import { connectionEmitter } from "modules/WebRTC";

const DEFAULT_BG_URL = "/assets/sprites/arena-1.png"

export class GameScene {
  bgImgUrl: string;
  imgBg: HTMLImageElement;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null | undefined;
  player: Fighter | undefined
  draw1: Draw | undefined
  avatar: Avatar | undefined

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
    this.draw1!.darwFighter(this.player!.position, this.player!.size, this.player!.attackBox)
    this.player!.update()
    this.draw1!.darwFighter(this.avatar!.position, this.avatar!.size, this.avatar!.attackBox)
    this.avatar!.update()
  }

  init() {
    this.draw1 = new Draw(this.canvas, this.ctx)
    this.player = new Fighter()
    this.avatar = new Avatar({x: 400, y: 0})
    this.player!.onEvents()
    this.avatar!.onEvents()
  }

  exit() { }
}
