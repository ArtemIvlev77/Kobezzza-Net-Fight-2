// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<This, Args extends unknown[], Return>(delay: number): any {
  return function (target: (this: This, ...args: Args) => Return) {
    let timer: NodeJS.Timeout | undefined

    return function(this: This, ...args: Args) {
      if (timer != null) {
        clearTimeout(timer)
      }
  
      timer = setTimeout(() => {
        target.apply(this, args)
        timer = undefined
      }, delay)
    }
  }
}
