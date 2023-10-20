// @ts-nocheck
import { Fighter } from "./Fighter";
import { connectionEmitter, avatarEE } from "modules/WebRTC/WebRTC";
const gravity = 7

export class Avatar extends Fighter {
  constructor(position = {x: 0, y: 0}, size = {width: 50, height: 150}, velocity = {x: 0, y: gravity}) {
    super(position, size, velocity)
  }

  onEvents() {
    // avatarEE.on('jumping', this.jump.bind(this))
    // avatarEE.on('moveLeft', this.moveLeft.bind(this))
    // avatarEE.on('moveRight', this.moveRight.bind(this))
    // avatarEE.on('jumpingEnd', this.jumpEnd.bind(this))
    // avatarEE.on('moveLeftEnd', this.moveLeftEnd.bind(this))
    // avatarEE.on('moveRightEnd', this.moveRightEnd.bind(this))
    avatarEE.on('p', (data) => this.setPosition(JSON.parse(data)))
  }

  setPosition(data) {
    console.log('data', data, data.x, data.y)
    this.position.y = data.y
    this.position.x = 1316 - data.x
  }

  override update() {
    this.position.y += this.velocity.y
    this.position.x += this.velocity.x
    this.onGround()
    // установить координаты для аватара
  }
}
