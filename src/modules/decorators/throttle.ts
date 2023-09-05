// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<This, Args extends unknown[], Return>(delay: number): any {
  return function (target: (this: This, ...args: Args) => Return) {
    let
      timer: NodeJS.Timeout | undefined,
      lastArgs: Args

      return function wrapper(this: This, ...args: Args): void {
        lastArgs = args
    
        if (timer == null) {
          target.apply(this, args)
    
          timer = setTimeout(() => {
            timer = undefined
    
            if (lastArgs !== args) {
              wrapper.apply(this, lastArgs)
            }
          }, delay)
        }
      }
  }
}