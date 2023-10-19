// @ts-nocheck
import { Fighter } from "./Fighter";
import { ee } from "../EventEmitter"
import { connectionEmitter, avatarEE } from "modules/WebRTC/WebRTC";
const gravity = 7

export class Avatar extends Fighter {
  constructor(position = {x: 0, y: 0}, size = {width: 50, height: 150}, velocity = {x: 0, y: gravity}) {
    super(position, size, velocity)
  }

  onEvents() {
    avatarEE.on('jumping', this.jump.bind(this))
    avatarEE.on('moveLeft', this.moveLeft.bind(this))
    avatarEE.on('moveRight', this.moveRight.bind(this))
    avatarEE.on('jumpingEnd', this.jumpEnd.bind(this))
    avatarEE.on('moveLeftEnd', this.moveLeftEnd.bind(this))
    avatarEE.on('moveRightEnd', this.moveRightEnd.bind(this))
    // avatarEE.on('position', cb(data))
  }

  // set position(data) {
  //   this.position = data
  // }

  // setPosition(position: any): void {
  //   this.position = position
  // }

  // update(position) {
  //   console.log(position)
  //   super.update()
  //   this.position = position
  // }
}