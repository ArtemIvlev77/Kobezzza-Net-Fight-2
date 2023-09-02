interface IEventEmitter {
  on: (event: string, cb: Cb) => void
  off: (event?: string, cb?: Cb) => void
  emit: (event: string, ...args: unknown[]) => void
  once: (event: string, cb: Cb) => void
}

type Cb = ((...args: unknown[]) => unknown) & { once?: boolean }

export class EventEmitter implements IEventEmitter {
  private handlers: Map<string, Set<Cb>>
  
  constructor() {
    this.handlers = new Map()
  }

  on(event: string, cb: Cb): void {
    this.getCbSet(event).add(cb)
  }

  off(event?: string, cb?: Cb): void {
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

  emit(event: string, ...args: unknown[]): void {
    this.getCbSet(event).forEach(cb => {
      cb(...args)

      if(cb.once) {
        this.off(event, cb)
      }
    })
  }

  once(event: string, cb: Cb): void {
    cb.once = true
    this.on(event, cb)
  }

  private getCbSet(event: string): Set<Cb> {
    if (this.handlers.has(event)) {
      return this.handlers.get(event)!
    }

    const set: Set<Cb> = new Set()
    this.handlers.set(event, set)
    return set
  }
}
