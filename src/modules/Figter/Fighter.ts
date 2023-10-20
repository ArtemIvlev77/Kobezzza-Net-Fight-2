import { Widget } from "modules/root";
import { ee } from "../EventEmitter"
import { AttackBox } from './AttackBox'
import { SupportedMessageType } from "modules/WebRTC";

const gravity = 7

type Position = {
  x: number;
  y: number;
}

export class Fighter extends Widget {
  position: Position;
  #size
  velocity
  #attackBox
  // start = false

  constructor(position = {x: 0, y: 0}, size = {width: 50, height: 150}, velocity = {x: 0, y: gravity}) {
    super()

    this.position = position
    this.#size = size
    this.velocity = velocity

    this.#attackBox = new AttackBox(this.position)
  }

  onEvents() {
    ee.on('jump', this.jump.bind(this))
    ee.on('moveLeft', this.moveLeft.bind(this))
    ee.on('moveRight', this.moveRight.bind(this))
    ee.on('jumpEnd', this.jumpEnd.bind(this))
    ee.on('moveLeftEnd', this.moveLeftEnd.bind(this))
    ee.on('moveRightEnd', this.moveRightEnd.bind(this))
  }

  // TODO: декоратор intoIter(лучше на свойство)
  get size() {
    const that = this
    return {
      ...this.position,
      [Symbol.iterator]() {
        const
          iter = Object.keys(that.#size).values()

        return {
          next() {
            const { value, done } = iter.next()

            return {
              // @ts-ignore
              value: that.#size[value],
              done
            }
          }
        }
      }
    }
  }

  get attackBox() {
    return this.#attackBox
  }

  get getPosition() {
    const that = this
    return {
      ...this.position,
      [Symbol.iterator]() {
        const
          iter = Object.keys(that.position).values()

        return {
          next() {
            const { value, done } = iter.next()

            return {
              // @ts-ignore
              value: that.position[value],
              done
            }
          }
        }
      }
    }
  }

  onGround() {
    if(this.position.y + this.#size.height >= 726) {
      this.velocity.y = 0
    }
  }

  update() {
    this.position.y += this.velocity.y
    this.position.x += this.velocity.x
    this.onGround()

    this.root.connection.sendMessage({
      type: 'message',
      message: {
        // FIXME cast looks in this place incorrect
        type: JSON.stringify(this.position) as SupportedMessageType,
      },
    })
  }
  // Moving, паттерн service, миксин
  // декоратор trottel
  // @throttle(1000)
  jump() {
    // @ts-ignore
    this.sendData = true
    this.velocity.y = -20
  }

  moveRight() {
    // @ts-ignore
    this.sendData = true
    this.velocity.x = 2
  }

  moveLeft() {
    // @ts-ignore
    this.sendData = true
    this.velocity.x = -2
  }

  jumpEnd() {
    this.velocity.y = gravity
  }

  moveRightEnd() {
    this.velocity.x = 0
  }

  moveLeftEnd() {
    this.velocity.x = 0
  }
}
