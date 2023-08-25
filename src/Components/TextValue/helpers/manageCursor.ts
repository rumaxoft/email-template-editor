/**
 * detects if cursor index at the start of value and returns moved cursor to the end of value
 * @param {string} string string in textarea
 * @param {Record<string, string>} values values
 * @param {number} cursorIndex current cursor index in textarea
 * @returns {number} cursor index
 */
export const moveCursorRight = (string: string, values: Record<string, string> = {}, cursorIndex: number): number => {
  let value = ''
  let closeBraceIndex = -1
  if (string[cursorIndex] === '{') {
    for (let i = cursorIndex + 1; i < string.length; i++) {
      if (string[i] !== '}') {
        value = value + string[i]
      } else {
        closeBraceIndex = i
        break
      }
    }
    if (value in values) {
      return closeBraceIndex
    } else {
      return cursorIndex
    }
  } else {
    return cursorIndex
  }
}

/**
 * detects if cursor index at the end of value and returns moved cursor to the end of value
 * @param {string} string string in textarea
 * @param {Record<string, string>} values values
 * @param {number} cursorIndex current cursor index in textarea
 * @returns {number} cursor index
 */
export const moveCursorLeft = (string: string, values: Record<string, string> = {}, cursorIndex: number): number => {
  let value = ''
  let openBraceIndex = -1
  if (string[cursorIndex - 1] === '}') {
    for (let i = cursorIndex - 2; i >= 0; i--) {
      if (string[i] !== '{') {
        value = string[i] + value
      } else {
        openBraceIndex = i
        break
      }
    }
    if (value in values) {
      return openBraceIndex
    } else {
      return cursorIndex
    }
  } else {
    return cursorIndex
  }
}

/**
 * detects if cursor index in value and returns moved cursor to the end of value
 * @param {string} string string in textarea
 * @param {Record<string, string>} values values
 * @param {number} cursorIndex current cursor index in textarea
 * @returns {number} cursor index
 */
export const moveCursorFromValue = (
  string: string,
  values: Record<string, string> = {},
  cursorIndex: number,
): number => {
  let value = ''
  let openBrace = false
  let closeBraceIndex = -1
  for (let i = cursorIndex; i >= 0; i--) {
    if (string[i] !== '{') {
      value = string[i] + value
    } else {
      openBrace = true
      break
    }
  }
  if (!openBrace) return cursorIndex
  for (let i = cursorIndex + 1; i < string.length; i++) {
    if (string[i] !== '}') {
      value = value + string[i]
    } else {
      closeBraceIndex = i + 1
      break
    }
  }
  if (value in values) {
    return closeBraceIndex
  } else {
    return cursorIndex
  }
}

/**
 * manages deleting value
 * @param {string} string string in textarea
 * @param {Record<string, string>} values values
 * @param {number} cursorIndex current cursor index in textarea
 * @returns {[string, number]} [string without value, cursor index]
 */

export const manageDelete = (
  string: string,
  values: Record<string, string> = {},
  cursorIndex: number,
): [string, number] => {
  let value = ''
  let openBraceIndex = -1
  let closeBraceIndex = -1
  if (string[cursorIndex] === '{') {
    openBraceIndex = cursorIndex
    for (let i = cursorIndex + 1; i <= string.length; i++) {
      if (string[i] === '}') {
        closeBraceIndex = i + 1
        if (value in values) {
          return [string.slice(0, openBraceIndex) + string.slice(closeBraceIndex), openBraceIndex]
        } else {
          return [string, cursorIndex]
        }
      } else {
        value = value + string[i]
      }
    }
  }
  return [string, cursorIndex]
}

/**
 * manages backspace value
 * @param {string} string string in textarea
 * @param {Record<string, string>} values values
 * @param {number} cursorIndex current cursor index in textarea
 * @returns {[string, number]} [string without value, cursor index]
 */

export const manageBackspace = (
  string: string,
  values: Record<string, string> = {},
  cursorIndex: number,
): [string, number] => {
  let value = ''
  let openBraceIndex = -1
  let closeBraceIndex = -1
  if (string[cursorIndex - 1] === '}') {
    closeBraceIndex = cursorIndex
    for (let i = cursorIndex - 2; i >= 0; i--) {
      if (string[i] === '{') {
        openBraceIndex = i
        if (value in values) {
          return [string.slice(0, openBraceIndex) + string.slice(closeBraceIndex), openBraceIndex]
        } else {
          return [string, cursorIndex]
        }
      } else {
        value = string[i] + value
      }
    }
  }
  return [string, cursorIndex]
}
