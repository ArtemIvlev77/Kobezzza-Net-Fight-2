export interface ToggleableItemRawI {
  id: number;
}

export interface ToggleableItemI {
  id: number;
  next: number;
  prev: number;
}

export class ToggleableList {
  list: ToggleableItemI[];
  current: ToggleableItemI;

  constructor({ list }: { list: ToggleableItemRawI[] }) {
    this.list = this.#genList({ list })
    this.current = this.list[0]
    this.get = this.get.bind(this)
    this.setById = this.setById.bind(this)
    this.toggleToNext = this.toggleToNext.bind(this)
    this.toggleToPrev = this.toggleToPrev.bind(this)
  }

  #genList({ list }: { list: ToggleableItemRawI[] }): ToggleableItemI[] {
    return list.map((item, index) => {
      const length = list.length
      const isFirst = index === 0
      const isLast = index === length - 1
      const next = isLast ? list[0].id : list[index + 1].id
      const prev = isFirst ? list[length - 1].id : list[index - 1].id

      return ({
        id: item.id,
        next: next,
        prev: prev,
      })
    })
  }

  get(idArg: number) {
    return this.list.find(({ id }) => id === idArg)!
  }

  setById(newId: number) {
    const newState = this.list.find(({ id }) => id === newId)!
    this.current = newState
  }

  toggleToNext() {
    const newState = this.list.find(({ id }) => id === this.current.next)!
    this.current = newState
  }

  toggleToPrev() {
    const newState = this.list.find(({ id }) => id === this.current.prev)!
    this.current = newState
  }
}
