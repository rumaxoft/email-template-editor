export const generateAst = (string: string, values: Record<string, string> = {}) => {
  const ast = []
  let substr = ''
  let value = ''
  let openBrace = false
  for (let char of string) {
    if (openBrace) {
      if (char === '}') {
        openBrace = false
        value += char
        if (value.length > 2) {
          if (value.slice(1, -1) in values) {
            ast.push({
              value: substr,
              type: 'text',
            })
            ast.push({
              value,
              type: 'value',
            })
            value = ''
            substr = ''
          } else {
            ast.push({
              value: substr + value,
              type: 'text',
            })
            value = ''
            substr = ''
          }
        } else {
          ast.push({
            value: substr + value,
            type: 'text',
          })
          value = ''
          substr = ''
        }
      } else if (char === '{') {
        ast.push({
          value: substr + value,
          type: 'text',
        })
        value = ''
        substr = ''
      } else {
        value += char
      }
    } else {
      if (char === '{') {
        openBrace = true
        value += char
      } else {
        substr += char
      }
    }
  }
  if (substr) {
    ast.push({
      value: substr,
      type: 'text',
    })
  }
  return ast
}
