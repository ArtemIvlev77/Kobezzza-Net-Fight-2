interface IEventEmitter<T> {
  on: (event: T, cb: Cb) => void
  off: (event?: T, cb?: Cb) => void
  emit: (event: T, ...args: unknown[]) => void
  once: (event: T, cb: Cb) => void
}

type Cb = ((...args: unknown[]) => unknown) & { once?: boolean }

export class EventEmitter<T> implements IEventEmitter<T> {
  private handlers: Map<T, Set<Cb>>

  constructor() {
    this.handlers = new Map()
  }

  on(event: T, cb: Cb): void {
    this.getCbSet(event).add(cb)
  }

  off(event?: T, cb?: Cb): void {
    if (event == null) {
      this.handlers.clear()
      return
    }

    if (cb == null) {
      this.getCbSet(event).clear()
      return
    }

    this.getCbSet(event).delete(cb)
  }

  emit(event: T, ...args: unknown[]): void {
    this.getCbSet(event).forEach(cb => {
      cb(...args)

      if (cb.once) {
        this.off(event, cb)
      }
    })
  }

  once(event: T, cb: Cb): void {
    cb.once = true
    this.on(event, cb)
  }

  private getCbSet(event: T): Set<Cb> {
    if (this.handlers.has(event)) {
      return this.handlers.get(event)!
    }

    const set: Set<Cb> = new Set()
    this.handlers.set(event, set)
    return set
  }
}
