interface TemplateNode {
  value: string | TemplateNode[]
  type: string
  id: number
}

export interface Value extends TemplateNode {
  value: string
  type: 'value'
  id: number
}

export interface Text extends TemplateNode {
  value: string
  type: 'text'
  id: number
}

export interface TextValue extends TemplateNode {
  value: Array<Text | Value>
  type: 'textValue'
  id: number
}

export interface If extends TemplateNode {
  value: Array<Text | Value>
  type: 'if'
  id: number
}

export interface ThenElse extends TemplateNode {
  value: Array<TextValue | IfThenElse>
  type: 'thenElse'
  id: number
}

export interface IfThenElse extends TemplateNode {
  value: [TextValue, ThenElse, ThenElse]
  type: 'ifThenElse'
  id: number
}

export type Template = {
  value: Array<TextValue | IfThenElse>
  type: 'template'
  id: number
}

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export abstract class TemplateMessageGenerator {
  static generateMessageText(template: string, values: Record<string, string>): string {
    return ''
  }
}

export class TemplateMessageBuilder implements TemplateMessageGenerator {
  private templateAst: Template
  idCount: number = 0

  constructor(template: string = '{"value": [], "type": "template"}') {
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

    const resolveMessage = (templateNodes: TemplateNode[] | string) => {
      if (!Array.isArray(templateNodes)) return
      for (let node of templateNodes) {
        if (node.type === 'text') {
          message += node.value
        } else if (node.type === 'value') {
          if (typeof node.value === 'string') {
            const resolvedValue = values[node.value]
            if (resolvedValue) {
              message += resolvedValue
            }
          }
        } else if (node.type === 'ifThenElse') {
          if (!Array.isArray(node.value)) return
          const [ifNode, thenNode, elseNode] = node.value
          if (!Array.isArray(ifNode.value)) return
          let resolvedIfNode = ''
          for (let node of ifNode.value) {
            if (node.type === 'text') {
              resolvedIfNode += node.value
            } else if (node.type === 'value') {
              if (typeof node.value === 'string') {
                const value = values[node.value]
                if (value) {
                  resolvedIfNode += value
                }
              }
            }
          }
          if (resolvedIfNode) {
            resolveMessage(thenNode.value)
          } else resolveMessage(elseNode.value)
        } else if (node.type === 'textValue') {
          resolveMessage(node.value)
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
    const removeId = (templateNodes: Optional<TemplateNode, 'id'>[] | string) => {
      if (Array.isArray(templateNodes)) {
        for (let node of templateNodes) {
          delete node.id
          removeId(node.value)
        }
      } else {
        return
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
   * parses template string and adds ids to nodes
   * @param {string} template template string
   * @returns {Template}
   */
  private parse(template: string): Template {
    const templateAst = JSON.parse(template)
    if (templateAst.value.length === 0) {
      templateAst.value.push({
        value: [
          {
            value: '',
            type: 'text',
          },
        ],
        type: 'textValue',
      })
    }
    const addId = (templateNodes: TemplateNode[] | string) => {
      if (Array.isArray(templateNodes)) {
        for (let node of templateNodes) {
          node.id = this.idCount++
          addId(node.value)
        }
      } else {
        return
      }
    }
    addId(templateAst.value)
    return templateAst
  }

  /**
   * finds TemplateNode and it's parent by id
   * @param {number} id id of the TemplateNode
   * @returns {[TemplateNode | null, TemplateNode | null]}
   */
  private findById(id: number): [TemplateNode | null, TemplateNode | null] {
    let foundNode: TemplateNode | null = null
    let parentNode: TemplateNode | null = null
    const find = (templateNodes: Array<TemplateNode> | string, parent: TemplateNode) => {
      if (foundNode) return
      if (Array.isArray(templateNodes)) {
        for (let node of templateNodes) {
          if (node.id === id) {
            if (!foundNode) {
              foundNode = node
            }
            if (!parentNode) {
              parentNode = parent
            }
          } else {
            find(node.value, node)
          }
        }
      } else {
        return
      }
    }
    find(this.templateAst.value, this.templateAst)
    return [foundNode, parentNode]
  }

  // // TO-DO: make search logN (if need)
  // private findNodeUnderCursor(templateNodes: Array<TemplateNode>, index: number): TemplateNode | null {
  //   let node: TemplateNode | null = null
  //   let length = 0
  //   templateNodes.forEach((el) => {
  //     if (index < length) {
  //       length += el.value.length
  //     } else {
  //       node = el
  //     }
  //   })
  //   return node
  // }

  /**
   * adds text to the Text node
   * @param {string} value text value
   * @param {number} id id of the Text node
   * @param {number} cursorIndex index under cursor in the Text node
   * @returns {TemplateMessageBuilder} instance of the TemplateMessageBuilder for method chaining
   */
  public addText(value: string, id: number, cursorIndex: number): TemplateMessageBuilder {
    const [node, parent] = this.findById(id)
    if (!node || !parent) return this
    if (cursorIndex < 0 || cursorIndex > node.value.length) return this
    if (node && typeof node === 'object' && node.type === 'text') {
      node.value = node.value.slice(0, cursorIndex) + value + node.value.slice(cursorIndex)
    }
    return this
  }

  /**
   * removes text from the Text node
   * @param {number} length length of the removing text
   * @param {number} id id of the Text node
   * @param {number} startIndex index under cursor in the Text node
   * @returns {TemplateMessageBuilder} instance of the TemplateMessageBuilder for method chaining
   */
  public removeText(length: number, id: number, startIndex: number): TemplateMessageBuilder {
    const [node, parent] = this.findById(id)
    if (!node || !parent) return this
    if (node && typeof node === 'object' && typeof node.value === 'string' && node.type === 'text') {
      node.value = node.value.slice(0, startIndex) + node.value.slice(startIndex + length)
    }
    return this
  }

  /**
   * Adds Value node to TextValue node
   * @param {string} value - string value, represents variable.
   * @param {number} id - id of Text node.
   * @param {number} cursorIndex - index under cursor in the Text node.
   * @returns {TemplateMessageBuilder} instance of the TemplateMessageBuilder for method chaining
   */
  public addValue(value: string, id: number, cursorIndex: number): TemplateMessageBuilder {
    const [node, parentNode] = this.findById(id)
    if (!node || !parentNode) return this
    if (node && typeof node === 'object' && node.type === 'text') {
      const leftNode = {
        value: node.value.slice(0, cursorIndex),
        type: 'text',
        id: this.idCount++,
      }
      const valueNode = {
        value,
        type: 'value',
        id: this.idCount++,
      }
      const rightNode = {
        value: node.value.slice(cursorIndex),
        type: 'text',
        id: this.idCount++,
      }
      if (parentNode && Array.isArray(parentNode.value)) {
        const nodeIndex = parentNode.value.indexOf(node)
        parentNode.value.splice(nodeIndex, 1, leftNode, valueNode, rightNode)
      }
    }
    return this
  }

  /**
   * removes Value node from TextValue node
   * @param {number} id id of the Value node
   * @returns {TemplateMessageBuilder} instance of the TemplateMessageBuilder for method chaining
   */
  public removeValue(id: number): TemplateMessageBuilder {
    const [node, parentNode] = this.findById(id)
    if (!node || !parentNode) return this
    if (node && typeof node === 'object' && node.type === 'value') {
      if (Array.isArray(parentNode.value)) {
        const nodeIndex = parentNode.value.indexOf(node)
        const prevNode = parentNode.value[nodeIndex - 1]
        const nextNode = parentNode.value[nodeIndex + 1]
        if (
          prevNode &&
          typeof prevNode === 'object' &&
          prevNode.type === 'text' &&
          typeof prevNode.value === 'string' &&
          nextNode &&
          typeof nextNode === 'object' &&
          nextNode.type === 'text' &&
          typeof nextNode.value === 'string'
        ) {
          const concatenated = {
            value: prevNode.value + nextNode.value,
            type: 'text',
            id: this.idCount++,
          }
          parentNode.value.splice(nodeIndex - 1, 3, concatenated)
        } else {
          parentNode.value.splice(nodeIndex, 1)
        }
      }
    }
    return this
  }

  /**
   * adds IfThenElse node to TextValue node
   * @param {number} id - id of Text node.
   * @param {number} cursorIndex - index under cursor in the Text node.
   * @returns {TemplateMessageBuilder} instance of the TemplateMessageBuilder for method chaining
   */
  public addIfThenElse(id: number, cursorIndex: number): TemplateMessageBuilder {
    const [node, parentNode] = this.findById(id)
    if (!node || !parentNode) return this
    const [, grandParentNode] = this.findById(parentNode.id)
    if (node && typeof node === 'object' && node.type === 'text') {
      const leftNode = {
        value: node.value.slice(0, cursorIndex),
        type: 'text',
        id: this.idCount++,
      }
      const ifThenElseNode = {
        value: [
          {
            value: [
              {
                value: '',
                type: 'text',
                id: this.idCount++,
              },
            ],
            type: 'if',
            id: this.idCount++,
          },
          {
            value: [
              {
                value: [
                  {
                    value: '',
                    type: 'text',
                    id: this.idCount++,
                  },
                ],
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
                value: [
                  {
                    value: '',
                    type: 'text',
                    id: this.idCount++,
                  },
                ],
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
      }
      const rightNode = {
        value: node.value.slice(cursorIndex),
        type: 'text',
        id: this.idCount++,
      }

      if (parentNode && Array.isArray(parentNode.value)) {
        const nodeIndex = parentNode.value.indexOf(node)
        const leftTextValue = {
          value: [...parentNode.value.slice(0, nodeIndex), leftNode],
          type: 'textValue',
          id: this.idCount++,
        }
        const rightTextValue = {
          value: [rightNode, ...parentNode.value.slice(nodeIndex + 1)],
          type: 'textValue',
          id: this.idCount++,
        }
        if (grandParentNode && Array.isArray(grandParentNode.value)) {
          const parentNodeIndex = grandParentNode.value.indexOf(parentNode)
          grandParentNode.value.splice(parentNodeIndex, 1, leftTextValue, ifThenElseNode, rightTextValue)
        }
      }
    }
    return this
  }

  /**
   * removes IfThenElse node from TextValue node
   * @param {number} id id of the IfThenElse node
   * @returns {TemplateMessageBuilder} instance of the TemplateMessageBuilder for method chaining
   */
  public removeIfThenElse(id: number): TemplateMessageBuilder {
    const [node, parentNode] = this.findById(id)
    if (!node || !parentNode) return this
    if (typeof node !== 'object' || node.type !== 'ifThenElse') return this
    if (!Array.isArray(parentNode.value)) return this
    const nodeIndex = parentNode.value.indexOf(node)
    const prevNode = parentNode.value[nodeIndex - 1]
    const nextNode = parentNode.value[nodeIndex + 1]
    if (
      prevNode &&
      typeof prevNode === 'object' &&
      prevNode.type === 'textValue' &&
      Array.isArray(prevNode.value) &&
      nextNode &&
      typeof nextNode === 'object' &&
      nextNode.type === 'textValue' &&
      Array.isArray(nextNode.value)
    ) {
      const prevNodeInnerLast = prevNode.value[prevNode.value.length - 1]
      const nextNodeInnerFirst = nextNode.value[0]
      if (
        typeof prevNodeInnerLast === 'object' &&
        prevNodeInnerLast.type === 'text' &&
        typeof prevNodeInnerLast.value === 'string' &&
        typeof nextNodeInnerFirst === 'object' &&
        nextNodeInnerFirst.type === 'text' &&
        typeof nextNodeInnerFirst.value === 'string'
      ) {
        const innerConcatenated = {
          value: prevNodeInnerLast.value + nextNodeInnerFirst.value,
          type: 'text',
          id: this.idCount++,
        }
        const concatenated = {
          value: [...prevNode.value.slice(0, -1), innerConcatenated, ...nextNode.value.slice(1)],
          type: 'textValue',
          id: this.idCount++,
        }
        parentNode.value.splice(nodeIndex - 1, 3, concatenated)
      } else {
        const concatenated = {
          value: [...prevNode.value, ...nextNode.value],
          type: 'textValue',
          id: this.idCount++,
        }
        parentNode.value.splice(nodeIndex - 1, 3, concatenated)
      }
    } else {
      parentNode.value.splice(nodeIndex, 1)
    }
    return this
  }
}
