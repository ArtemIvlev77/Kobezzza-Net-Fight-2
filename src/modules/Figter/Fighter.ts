// @ts-nocheck
import { ee } from "../EventEmitter"
import { AttackBox } from './AttackBox'
import { throttle } from '../../modules/decorators'
import { rtcConnection } from '../WebRTC'

const gravity = 7

export class Fighter {
  #position
  #size
  #velocity
  #attackBox

  constructor(position = {x: 0, y: 0}, size = {width: 50, height: 150}, velocity = {x: 0, y: gravity}) {
    this.#position = position
    this.#size = size
    this.#velocity = velocity

    this.#attackBox = new AttackBox(this.#position)
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
      ...this.#position,
      [Symbol.iterator]() {
        const
          iter = Object.keys(that.#size).values()
          
        return {
          next() {
            const { value, done } = iter.next()

            return {
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

  get position() {
    const that = this
    return {
      ...this.#position,
      [Symbol.iterator]() {
        const
          iter = Object.keys(that.#position).values()
          
        return {
          next() {
            const { value, done } = iter.next()

            return {
              value: that.#position[value],
              done
            }
          }
        }
      }
    }
  }

  #onGround() {
    if(this.#position.y + this.#size.height >= 726) {
      this.#velocity.y = 0
    }
  }

  update() {
    this.#position.y += this.#velocity.y
    this.#position.x += this.#velocity.x
    this.#onGround()
  }
  // Moving, паттерн service, миксин
  // декоратор trottel
  // @throttle(1000)
  jump() {
    this.#velocity.y = -20
  }

  moveRight() {
    this.#velocity.x = 2
  }

  moveLeft() {
    this.#velocity.x = -2
  }

  jumpEnd() {
    this.#velocity.y = gravity
  }

  moveRightEnd() {
    this.#velocity.x = 0
  }

  moveLeftEnd() {
    this.#velocity.x = 0
  }
}
