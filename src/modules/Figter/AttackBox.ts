// @ts-nocheck
export class AttackBox {
  #position
  #width = 100
  #height = 50

  constructor(position) {
    this.#position = position
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

  get parames() {
    return [...this.position, this.#width, this.#height]
  }
}