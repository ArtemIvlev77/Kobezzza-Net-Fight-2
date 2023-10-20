// @ts-nocheck
import { SCENE } from "shared/config";
import { Fighter } from "./Fighter";
import { connectionEmitter, avatarEE } from "modules/WebRTC/WebRTC";
const gravity = 7

const AVATAR = {
  width: 50,
  height: 150,
}

export class Avatar extends Fighter {
  constructor(position = {x: 0, y: 0}, size = {width: AVATAR.width, height: AVATAR.height}, velocity = {x: 0, y: gravity}) {
    super(position, size, velocity)
  }

  onEvents() {
    avatarEE.on('p', (data) => this.setPosition(JSON.parse(data)))
  }

  setPosition(data) {
    console.log('data', data, data.x, data.y)
    this.position.y = data.y
    this.position.x = SCENE.width - AVATAR.width - data.x
  }

  override update() {
    this.position.y += this.velocity.y
    this.position.x += this.velocity.x
    this.onGround()
    // установить координаты для аватара
  }
}
