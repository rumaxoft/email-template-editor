export function throttle(cb: Function, delay = 200) {
  let shouldWait = false

  return (...args: any[]) => {
    if (shouldWait) return

    const returned = cb(...args)
    shouldWait = true
    setTimeout(() => {
      shouldWait = false
    }, delay)
    return returned
  }
}
