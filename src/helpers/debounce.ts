export function debounce(cb: Function, delay = 100) {
  let timeout: ReturnType<typeof setTimeout>

  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      cb(...args)
    }, delay)
  }
}
