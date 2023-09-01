import type { Template, TextValue, IfThenElse, TemplateNode } from '../../shared/Template'
export class TemplateMessageBuilder {
  private templateAst: Template
  idCount: number = 0

  constructor(template: string = '{"value": [], "type": "template"}') {
    if (template === '') template = '{"value": [], "type": "template"}'
    this.templateAst = this.parse(template)
  }

  /**
   * generates message text according to given values
   * @param {string} template template string
   * @param {Record<string, string>} values values
   * @returns {string} message text
   */
  static generateMessageText(template: string, values: Record<string, string>): string {
    const templateAst: Template = JSON.parse(template)
    let message = ''

    const resolveMessage = (templateNodes: Array<TextValue | IfThenElse>) => {
      for (let node of templateNodes) {
        if (node.type === 'textValue') {
          const resolvedString = node.value.replace(/\{.+?\}/g, (match) => {
            const valueKey = match.slice(1, -1)
            if (valueKey in values && values[valueKey]) {
              return values[valueKey]
            } else if (valueKey in values && !values[valueKey]) {
              return ''
            } else {
              return match
            }
          })
          message += resolvedString
        }
        if (node.type === 'ifThenElse') {
          const [ifNode, thenNode, elseNode] = node.value
          const resolvedIfString = ifNode.value.replace(/\{.+?\}/g, (match) => {
            const valueKey = match.slice(1, -1)
            if (valueKey in values && values[valueKey]) {
              return values[valueKey]
            } else if (valueKey in values && !values[valueKey]) {
              return ''
            } else {
              return match
            }
          })
          if (resolvedIfString.length > 0) {
            resolveMessage(thenNode.value)
          } else {
            resolveMessage(elseNode.value)
          }
        }
      }
    }

    resolveMessage(templateAst.value)

    return message
  }

  /**
   * generates template string for storage
   * @returns {string} string in json format with ids removed
   */
  public generateTemplate(): string {
    const templateAst = this.getTemplateAst()
    const removeId = (templateNodes: Array<TextValue | IfThenElse>) => {
      for (let node of templateNodes) {
        delete node.id
        if (node.type === 'ifThenElse') {
          const [ifNode, thenNode, elseNode] = node.value
          delete ifNode.id
          delete thenNode.id
          delete elseNode.id
          removeId(thenNode.value)
          removeId(elseNode.value)
        }
      }
    }
    removeId(templateAst.value)
    return JSON.stringify(templateAst)
  }

  /**
   * @returns {Template} copied object of templateAst property
   */
  public getTemplateAst(): Template {
    return JSON.parse(JSON.stringify(this.templateAst)) as Template
  }

  /**
   * returns value of TextValue node
   * @param {number} id id of the TextValue node
   * @returns {string | null} value of TextValue node
   */
  public getTextValue(id: number): string | null {
    const [found] = this.findById(id)
    if (found && found.type === 'textValue') {
      return found.value
    } else {
      return null
    }
  }

  /**
   * returns value of the first TextValue node
   * @returns {string | null} value of TextValue node
   */
  public getFirstTextValueId(): number | null {
    for (let node of this.templateAst.value) {
      if (node.type === 'textValue') {
        if (node.id !== undefined) {
          return node.id
        }
      } else if (node.type === 'ifThenElse') {
        const [ifNode] = node.value
        if (ifNode.id !== undefined) {
          return ifNode.id
        }
      } else {
        return null
      }
    }
    return null
  }

  /**
   * parses template string and adds ids to nodes
   * @param {string} template template string
   * @returns {Template}
   */
  private parse(template: string): Template {
    const templateAst = JSON.parse(template)
    if (templateAst.value.length === 0) {
      templateAst.value.push({
        value: '',
        type: 'textValue',
      })
    }
    const addId = (templateNodes: Array<TextValue | IfThenElse>) => {
      for (let node of templateNodes) {
        if (node.type === 'textValue') {
          node.id = this.idCount++
        } else if (node.type === 'ifThenElse') {
          const [ifNode, thenNode, elseNode] = node.value
          node.id = this.idCount++
          ifNode.id = this.idCount++
          thenNode.id = this.idCount++
          elseNode.id = this.idCount++
          addId(thenNode.value)
          addId(elseNode.value)
        }
      }
    }
    addId(templateAst.value)
    return templateAst
  }

  /**
   * finds TemplateNode and it's parent by id
   * @param {number} id id of the TemplateNode
   * @returns {[TemplateNode | null, TemplateNode | null]} returns array where [node, parentNode]
   */
  private findById(id: number): [TemplateNode | null, TemplateNode | null] {
    let foundNode: TemplateNode | null = null
    let parentNode: TemplateNode | null = null
    const find = (templateNodes: Array<TextValue | IfThenElse>, parent: TemplateNode) => {
      if (foundNode) return
      for (let node of templateNodes) {
        if (node.id === id) {
          foundNode = node
          parentNode = parent
        } else {
          if (node.type === 'ifThenElse') {
            const [ifNode, thenNode, elseNode] = node.value
            if (ifNode.id === id) {
              foundNode = ifNode
              parentNode = node
            }
            if (thenNode.id === id) {
              foundNode = thenNode
              parentNode = node
            }
            if (elseNode.id === id) {
              foundNode = elseNode
              parentNode = node
            }
            find(thenNode.value, thenNode)
            find(elseNode.value, elseNode)
          }
        }
      }
    }
    find(this.templateAst.value, this.templateAst)
    return [foundNode, parentNode]
  }

  /**
   * adds text to the Text node
   * @param {string} value text
   * @param {number} id id of the TextValue node
   * @returns {TemplateMessageBuilder} instance of the TemplateMessageBuilder for method chaining
   */
  public updateTextValue(value: string, id: number): TemplateMessageBuilder {
    const [node] = this.findById(id)
    if (node && node.type === 'textValue') {
      node.value = value
    }
    return this
  }

  /**
   * adds IfThenElse node to TextValue node
   * @param {number} id - id of Text node.
   * @param {number} cursorIndex - index under cursor in the TextValue node.
   * @returns {number} - id of the next TextValue node after added IfThenElse node
   */
  public addIfThenElse(id: number, cursorIndex: number): number {
    let nextTextValueId = -1
    const [node, parentNode] = this.findById(id)
    if (node && node.type === 'textValue') {
      const leftNode = {
        value: node.value.slice(0, cursorIndex),
        type: 'textValue',
        id: this.idCount++,
      } as TextValue
      const ifThenElseNode = {
        value: [
          {
            value: '',
            type: 'textValue',
            id: this.idCount++,
          },
          {
            value: [
              {
                value: '',
                type: 'textValue',
                id: this.idCount++,
              },
            ],
            type: 'thenElse',
            id: this.idCount++,
          },
          {
            value: [
              {
                value: '',
                type: 'textValue',
                id: this.idCount++,
              },
            ],
            type: 'thenElse',
            id: this.idCount++,
          },
        ],
        type: 'ifThenElse',
        id: this.idCount++,
      } as unknown as IfThenElse
      const rightNode = {
        value: node.value.slice(cursorIndex),
        type: 'textValue',
        id: (nextTextValueId = this.idCount++),
      } as TextValue

      if (parentNode && (parentNode.type === 'template' || parentNode.type === 'thenElse')) {
        const nodeIndex = parentNode.value.indexOf(node)
        parentNode.value.splice(nodeIndex, 1, leftNode, ifThenElseNode, rightNode)
      }
    } else {
      return nextTextValueId
    }
    return nextTextValueId
  }

  /**
   * removes IfThenElse node from TextValue node
   * @param {number} id id of the IfThenElse node
   * @returns {number} - id of the next TextValue node after removed IfThenElse node
   */
  public removeIfThenElse(id: number): number {
    let nextTextValueId = -1
    const [node, parentNode] = this.findById(id)
    if (
      node &&
      parentNode &&
      (parentNode.type === 'template' || parentNode.type === 'thenElse') &&
      node.type === 'ifThenElse'
    ) {
      const nodeIndex = parentNode.value.indexOf(node)
      const prevNode = parentNode.value[nodeIndex - 1]
      const nextNode = parentNode.value[nodeIndex + 1]
      if (prevNode && prevNode.type === 'textValue' && nextNode.type === 'textValue') {
        const concatenated = {
          value: prevNode.value + nextNode.value,
          type: 'textValue',
          id: (nextTextValueId = this.idCount++),
        } as TextValue
        parentNode.value.splice(nodeIndex - 1, 3, concatenated)
      } else {
        parentNode.value.splice(nodeIndex, 1)
      }
    }
    return nextTextValueId
  }
}
