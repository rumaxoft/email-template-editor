export type TextValue = {
  value: string
  type: 'textValue'
  id?: number
}

export type ThenElse = {
  value: Array<TextValue | IfThenElse>
  type: 'thenElse'
  id?: number
}

export type IfThenElse = {
  value: [TextValue, ThenElse, ThenElse]
  type: 'ifThenElse'
  id?: number
}

export type Template = {
  value: Array<TextValue | IfThenElse>
  type: 'template'
  id: number
}

export type TemplateNode = Template | TextValue | ThenElse | IfThenElse
