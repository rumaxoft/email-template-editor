import { expectedResult } from './fixtures/expectedTemplate'
import templateFixture from './fixtures/template.json'
import { TemplateMessageBuilder } from './TemplateMessageBuilder'

describe('create instance of TemplateMessageBuilder and test private parse function', () => {
  test('creates template when instance created without arguments', () => {
    const tmb = new TemplateMessageBuilder()
    const expectedResult = {
      value: [
        {
          value: '',
          type: 'textValue',
          id: 0,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })

  test('creates template when instance created with empty string', () => {
    const tmb = new TemplateMessageBuilder('')
    const expectedResult = {
      value: [
        {
          value: '',
          type: 'textValue',
          id: 0,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })

  test('adds ids', () => {
    const templateFixture = {
      value: [
        {
          value: 'Hello, {firstname}!',
          type: 'textValue',
        },
        {
          value: [
            {
              value: 'if text',
              type: 'textValue',
            },
            {
              value: 'thenElse text',
              type: 'thenElse',
            },
            {
              value: 'thenElse text',
              type: 'thenElse',
            },
          ],
          type: 'ifThenElse',
        },
      ],
      type: 'template',
    }
    const expectedResult = {
      value: [
        {
          value: 'Hello, {firstname}!',
          type: 'textValue',
          id: 0,
        },
        {
          value: [
            {
              value: 'if text',
              type: 'textValue',
              id: 2,
            },
            {
              value: 'thenElse text',
              type: 'thenElse',
              id: 3,
            },
            {
              value: 'thenElse text',
              type: 'thenElse',
              id: 4,
            },
          ],
          type: 'ifThenElse',
          id: 1,
        },
      ],
      type: 'template',
    }
    const templateString = JSON.stringify(templateFixture)
    const tmb = new TemplateMessageBuilder(templateString)
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })
})

describe('findById', () => {
  test('findById if  thenNode elseNode', () => {
    const templateFixture = {
      value: [
        {
          value: 'Hello, {firstname}!',
          type: 'textValue',
        },
        {
          value: [
            {
              value: 'if text',
              type: 'textValue',
            },
            {
              value: 'thenElse text',
              type: 'thenElse',
            },
            {
              value: 'thenElse text',
              type: 'thenElse',
            },
          ],
          type: 'ifThenElse',
        },
      ],
      type: 'template',
    }
    const tmb = new TemplateMessageBuilder(JSON.stringify(templateFixture))
    const [ifNode, parent] = tmb['findById'](2)
    const [thenNode] = tmb['findById'](3)
    const [elseNode] = tmb['findById'](4)
    expect(ifNode).toEqual({
      value: 'if text',
      type: 'textValue',
      id: 2,
    })
    expect(thenNode).toEqual({
      value: 'thenElse text',
      type: 'thenElse',
      id: 3,
    })
    expect(elseNode).toEqual({
      value: 'thenElse text',
      type: 'thenElse',
      id: 4,
    })
    expect(parent).toEqual({
      value: [
        {
          value: 'if text',
          type: 'textValue',
          id: 2,
        },
        {
          value: 'thenElse text',
          type: 'thenElse',
          id: 3,
        },
        {
          value: 'thenElse text',
          type: 'thenElse',
          id: 4,
        },
      ],
      type: 'ifThenElse',
      id: 1,
    })
  })
})

describe('getTextValue', () => {
  const templateFixture = {
    value: [
      {
        value: 'Hello, {firstname}!',
        type: 'textValue',
      },
      {
        value: [
          {
            value: 'if text',
            type: 'textValue',
          },
          {
            value: 'thenElse text',
            type: 'thenElse',
          },
          {
            value: 'thenElse text',
            type: 'thenElse',
          },
        ],
        type: 'ifThenElse',
      },
    ],
    type: 'template',
  }
  const tmb = new TemplateMessageBuilder(JSON.stringify(templateFixture))
  test('getTextValue if node exists', () => {
    const value = tmb.getTextValue(0)
    expect(value).toBe('Hello, {firstname}!')
  })
  test('getTextValue if node does not exist', () => {
    const value = tmb.getTextValue(-1)
    expect(value).toBe(null)
  })
  test('getTextValue if node is not textValue type', () => {
    const value = tmb.getTextValue(3)
    expect(value).toBe(null)
  })
})

describe('getFirstTextValueId', () => {
  const templateFixture = {
    value: [
      {
        value: 'Hello, {firstname}!',
        type: 'textValue',
      },
      {
        value: [
          {
            value: 'if text',
            type: 'textValue',
          },
          {
            value: 'thenElse text',
            type: 'thenElse',
          },
          {
            value: 'thenElse text',
            type: 'thenElse',
          },
        ],
        type: 'ifThenElse',
      },
    ],
    type: 'template',
  }
  const tmb = new TemplateMessageBuilder(JSON.stringify(templateFixture))
  test('getTextValue textValue found', () => {
    const id = tmb.getFirstTextValueId()
    expect(id).toBe(0)
  })
  test('getTextValue if ifNode found', () => {
    const templateFixture = {
      value: [
        {
          value: [
            {
              value: 'if text',
              type: 'textValue',
            },
            {
              value: 'thenElse text',
              type: 'thenElse',
            },
            {
              value: 'thenElse text',
              type: 'thenElse',
            },
          ],
          type: 'ifThenElse',
        },
      ],
      type: 'template',
    }
    const tmb = new TemplateMessageBuilder(JSON.stringify(templateFixture))
    const id = tmb.getFirstTextValueId()
    expect(id).toBe(1)
  })
  test('getTextValue if node not found', () => {
    const templateFixture = {
      value: [
        {
          value: '',
          type: 'invalidType',
        },
      ],
      type: 'template',
    }
    const tmb = new TemplateMessageBuilder(JSON.stringify(templateFixture))
    const id = tmb.getFirstTextValueId()
    expect(id).toBe(null)
  })
  test('getTextValue if id does not exist', () => {
    const templateFixture = {
      value: [
        {
          value: '',
          type: 'textValue',
        },
      ],
      type: 'template',
    }
    const tmb = new TemplateMessageBuilder(JSON.stringify(templateFixture))
    tmb['templateAst'].value[0].id = undefined
    const id = tmb.getFirstTextValueId()
    expect(id).toBe(null)
  })
  test('getTextValue if id of ifThenElse does not exist', () => {
    const templateFixture = {
      value: [
        {
          value: [
            {
              value: '',
              type: 'textValue',
            },
            {
              value: [],
              type: 'thenElse',
            },
            {
              value: [],
              type: 'thenElse',
            },
          ],
          type: 'ifThenElse',
        },
      ],
      type: 'template',
    }
    const tmb = new TemplateMessageBuilder(JSON.stringify(templateFixture))
    const ifThenElse = tmb['templateAst'].value[0]
    if (ifThenElse.type === 'ifThenElse') {
      ifThenElse.value[0].id = undefined
    }
    const id = tmb.getFirstTextValueId()
    expect(id).toBe(null)
  })
})

describe('update textValue', () => {
  const tmb = new TemplateMessageBuilder()

  test('update empty', () => {
    tmb.updateTextValue('Hello, Bill!', 0)
    const expectedResult = {
      value: [
        {
          value: 'Hello, Bill!',
          type: 'textValue',
          id: 0,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })

  test('update not empty', () => {
    tmb.updateTextValue('Hi, John!', 0)
    const expectedResult = {
      value: [
        {
          value: 'Hi, John!',
          type: 'textValue',
          id: 0,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })

  test('update nonexistent', () => {
    tmb.updateTextValue('will not commit', 2)
    const expectedResult = {
      value: [
        {
          value: 'Hi, John!',
          type: 'textValue',
          id: 0,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })

  test('removes all', () => {
    tmb.updateTextValue('', 0)
    const expectedResult = {
      value: [
        {
          value: '',
          type: 'textValue',
          id: 0,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })
})

describe('test add/remove inThenElse', () => {
  const tmb = new TemplateMessageBuilder()
  test('add ifThenElse', () => {
    tmb.updateTextValue('Hello, Bill!\nBest regards,', 0)
    tmb.addIfThenElse(0, 12)
    const expectedResult = {
      value: [
        {
          value: 'Hello, Bill!',
          type: 'textValue',
          id: 1,
        },
        {
          value: [
            {
              value: '',
              type: 'textValue',
              id: 2,
            },
            {
              value: [
                {
                  value: '',
                  type: 'textValue',
                  id: 3,
                },
              ],
              type: 'thenElse',
              id: 4,
            },
            {
              value: [
                {
                  value: '',
                  type: 'textValue',
                  id: 5,
                },
              ],
              type: 'thenElse',
              id: 6,
            },
          ],
          type: 'ifThenElse',
          id: 7,
        },
        {
          value: '\nBest regards,',
          type: 'textValue',
          id: 8,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })

  test('add ifThenElse wrong parent', () => {
    const tmb = new TemplateMessageBuilder()
    const mockedTemplateAst = {
      value: [
        {
          value: '',
          type: 'textValue',
          id: 0,
        },
      ],
      type: 'template-wrong',
    }
    //@ts-ignore
    tmb.templateAst = mockedTemplateAst
    tmb.addIfThenElse(0, 0)
    expect(tmb.getTemplateAst()).toEqual(mockedTemplateAst)
  })

  test('add ifThenElse to the wrong node', () => {
    tmb.addIfThenElse(2, 12)
    const expectedResult = {
      value: [
        {
          value: 'Hello, Bill!',
          type: 'textValue',
          id: 1,
        },
        {
          value: [
            {
              value: '',
              type: 'textValue',
              id: 2,
            },
            {
              value: [
                {
                  value: '',
                  type: 'textValue',
                  id: 3,
                },
              ],
              type: 'thenElse',
              id: 4,
            },
            {
              value: [
                {
                  value: '',
                  type: 'textValue',
                  id: 5,
                },
              ],
              type: 'thenElse',
              id: 6,
            },
          ],
          type: 'ifThenElse',
          id: 7,
        },
        {
          value: '\nBest regards,',
          type: 'textValue',
          id: 8,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })

  test('add ifThenElse to the wrong node and right id', () => {
    tmb.addIfThenElse(7, 7)
    const expectedResult = {
      value: [
        {
          value: 'Hello, Bill!',
          type: 'textValue',
          id: 1,
        },
        {
          value: [
            {
              value: '',
              type: 'textValue',
              id: 2,
            },
            {
              value: [
                {
                  value: '',
                  type: 'textValue',
                  id: 3,
                },
              ],
              type: 'thenElse',
              id: 4,
            },
            {
              value: [
                {
                  value: '',
                  type: 'textValue',
                  id: 5,
                },
              ],
              type: 'thenElse',
              id: 6,
            },
          ],
          type: 'ifThenElse',
          id: 7,
        },
        {
          value: '\nBest regards,',
          type: 'textValue',
          id: 8,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })

  test('remove nonexistent ifThenElse', () => {
    tmb.removeIfThenElse(70)
    const expectedResult = {
      value: [
        {
          value: 'Hello, Bill!',
          type: 'textValue',
          id: 1,
        },
        {
          value: [
            {
              value: '',
              type: 'textValue',
              id: 2,
            },
            {
              value: [
                {
                  value: '',
                  type: 'textValue',
                  id: 3,
                },
              ],
              type: 'thenElse',
              id: 4,
            },
            {
              value: [
                {
                  value: '',
                  type: 'textValue',
                  id: 5,
                },
              ],
              type: 'thenElse',
              id: 6,
            },
          ],
          type: 'ifThenElse',
          id: 7,
        },
        {
          value: '\nBest regards,',
          type: 'textValue',
          id: 8,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })

  test('remove ifThenElse', () => {
    tmb.removeIfThenElse(7)
    const expectedResult = {
      value: [
        {
          value: 'Hello, Bill!\nBest regards,',
          type: 'textValue',
          id: 17,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })

  test('remove ifThenElse without concatenation', () => {
    const template = {
      value: [
        {
          value: 'Hello, Bill!',
          type: 'textValue',
        },
        {
          value: [
            {
              value: '',
              type: 'textValue',
            },
            {
              value: [
                {
                  value: '',
                  type: 'textValue',
                },
              ],
              type: 'thenElse',
            },
            {
              value: [
                {
                  value: '',
                  type: 'textValue',
                },
              ],
              type: 'thenElse',
            },
          ],
          type: 'ifThenElse',
        },
        {
          value: [
            {
              value: '',
              type: 'textValue',
            },
            {
              value: [
                {
                  value: '',
                  type: 'textValue',
                },
              ],
              type: 'thenElse',
            },
            {
              value: [
                {
                  value: '',
                  type: 'textValue',
                },
              ],
              type: 'thenElse',
            },
          ],
          type: 'ifThenElse',
        },
        {
          value: '\nBest regards,',
          type: 'textValue',
        },
      ],
      type: 'template',
    }
    const tmb = new TemplateMessageBuilder(JSON.stringify(template))
    tmb.removeIfThenElse(1)
    const expectedResult = {
      value: [
        {
          value: 'Hello, Bill!',
          type: 'textValue',
          id: 0,
        },
        {
          value: [
            {
              value: '',
              type: 'textValue',
              id: 8,
            },
            {
              value: [
                {
                  value: '',
                  type: 'textValue',
                  id: 11,
                },
              ],
              type: 'thenElse',
              id: 9,
            },
            {
              value: [
                {
                  value: '',
                  type: 'textValue',
                  id: 12,
                },
              ],
              type: 'thenElse',
              id: 10,
            },
          ],
          type: 'ifThenElse',
          id: 7,
        },
        {
          value: '\nBest regards,',
          type: 'textValue',
          id: 13,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
    tmb.addIfThenElse(12, 0)
    tmb.removeIfThenElse(20)
    const expectedResult2 = {
      value: [
        {
          value: 'Hello, Bill!',
          type: 'textValue',
          id: 0,
        },
        {
          value: [
            {
              value: '',
              type: 'textValue',
              id: 8,
            },
            {
              value: [
                {
                  value: '',
                  type: 'textValue',
                  id: 11,
                },
              ],
              type: 'thenElse',
              id: 9,
            },
            {
              value: [
                {
                  value: '',
                  type: 'textValue',
                  id: 22,
                },
              ],
              type: 'thenElse',
              id: 10,
            },
          ],
          type: 'ifThenElse',
          id: 7,
        },
        {
          value: '\nBest regards,',
          type: 'textValue',
          id: 13,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult2)
  })
})

describe('test generateMessageText', () => {
  const templateString = JSON.stringify(templateFixture)
  test('generate message text with all variables defined', () => {
    const message = TemplateMessageBuilder.generateMessageText(templateString, {
      firstname: 'Bill',
      lastname: 'Gates',
      company: 'Bill & Melinda Gates Foundation',
      position: 'Co-chair',
    })
    const expectedResult = `Hello, Bill Gates!

I just went through your profile and I would love to join your network!
I know you work at Bill & Melinda Gates Foundation as Co-chair.;)

Jake,
Software Developer
jakelennard911@gmail.com`
    expect(message).toBe(expectedResult)
  })

  test('generate message text with all variables defined and generated message', () => {
    const tmb = new TemplateMessageBuilder(JSON.stringify(templateFixture))
    const generatedTemplate = tmb.generateTemplate()
    const message = TemplateMessageBuilder.generateMessageText(generatedTemplate, {
      firstname: 'Bill',
      lastname: 'Gates',
      company: 'Bill & Melinda Gates Foundation',
      position: 'Co-chair',
    })
    const expectedResult = `Hello, Bill Gates!

I just went through your profile and I would love to join your network!
I know you work at Bill & Melinda Gates Foundation as Co-chair.;)

Jake,
Software Developer
jakelennard911@gmail.com`
    expect(message).toBe(expectedResult)
  })

  test('generate message text with one variable undefined', () => {
    const message = TemplateMessageBuilder.generateMessageText(templateString, {
      firstname: 'Bill',
      lastname: 'Gates',
      company: 'Bill & Melinda Gates Foundation',
    })
    const expectedResult = `Hello, Bill Gates!

I just went through your profile and I would love to join your network!
I know you work at Bill & Melinda Gates Foundation, but what is your role?;)

Jake,
Software Developer
jakelennard911@gmail.com`
    expect(message).toBe(expectedResult)
  })

  test('generate message text with two variables undefined', () => {
    const message = TemplateMessageBuilder.generateMessageText(templateString, {
      firstname: 'Bill',
      lastname: 'Gates',
    })
    const expectedResult = `Hello, Bill Gates!

I just went through your profile and I would love to join your network!
Where do you work at the moment?

Jake,
Software Developer
jakelennard911@gmail.com`
    expect(message).toBe(expectedResult)
  })

  test('generate message text with one variables undefined', () => {
    const message = TemplateMessageBuilder.generateMessageText(templateString, {
      firstname: 'Bill',
    })
    const expectedResult = `Hello, Bill {lastname}!

I just went through your profile and I would love to join your network!
Where do you work at the moment?

Jake,
Software Developer
jakelennard911@gmail.com`
    expect(message).toBe(expectedResult)
  })

  test('generate message text with textNode in ifNode and undefined variable', () => {
    const template = {
      value: [
        {
          value: 'Hello, Bill!\n',
          type: 'textValue',
        },
        {
          value: [
            {
              value: 'true',
              type: 'textValue',
            },
            {
              value: [
                {
                  value: 'This text should be shown.',
                  type: 'textValue',
                },
              ],
              type: 'thenElse',
            },
            {
              value: [
                {
                  value: 'This text should not be shown.',
                  type: 'textValue',
                },
              ],
              type: 'thenElse',
            },
          ],
          type: 'ifThenElse',
        },
        {
          value: '\nBest regards!',
          type: 'textValue',
        },
      ],
      type: 'template',
    }
    const message = TemplateMessageBuilder.generateMessageText(JSON.stringify(template), {})
    const expectedResult = `Hello, Bill!
This text should be shown.
Best regards!`
    expect(message).toBe(expectedResult)
  })

  test('generate message text with no text in ifNode and undefined variable', () => {
    const template = {
      value: [
        {
          value: 'Hello, Bill!\n',
          type: 'textValue',
        },
        {
          value: [
            {
              value: '',
              type: 'textValue',
            },
            {
              value: [
                {
                  value: 'This text should not be shown.',
                  type: 'textValue',
                },
              ],
              type: 'thenElse',
            },
            {
              value: [
                {
                  value: 'This text should be shown.',
                  type: 'textValue',
                },
              ],
              type: 'thenElse',
            },
          ],
          type: 'ifThenElse',
        },
        {
          value: '\nBest regards!',
          type: 'textValue',
        },
      ],
      type: 'template',
    }
    const message = TemplateMessageBuilder.generateMessageText(JSON.stringify(template), {})
    const expectedResult = `Hello, Bill!
This text should be shown.
Best regards!`
    expect(message).toBe(expectedResult)
  })
})

describe('test generateTemplate', () => {
  const templateString = JSON.stringify(templateFixture)
  const tmb = new TemplateMessageBuilder(templateString)
  test('generateMessageText', () => {
    const generatedTemplateString = tmb.generateTemplate()
    expect(generatedTemplateString).toBe(expectedResult)
  })
})
