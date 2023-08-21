import { expectedResult } from './fixtures/expectedTemplate'
import templateFixture from './fixtures/template.json'
import { TemplateMessageBuilder } from './parser'

describe('create instance of TemplateMessageBuilder and test private parse function', () => {
  test('creates template when instance created without arguments', () => {
    const tmb = new TemplateMessageBuilder()
    const expectedResult = {
      value: [
        {
          value: [
            {
              value: '',
              type: 'text',
              id: 1,
            },
          ],
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
          value: [
            {
              value: 'Hello, ',
              type: 'text',
            },
            {
              value: 'firstname',
              type: 'value',
            },
            {
              value: '!',
              type: 'text',
            },
          ],
          type: 'textValue',
        },
      ],
      type: 'template',
    }
    const expectedResult = {
      value: [
        {
          value: [
            {
              value: 'Hello, ',
              type: 'text',
              id: 1,
            },
            {
              value: 'firstname',
              type: 'value',
              id: 2,
            },
            {
              value: '!',
              type: 'text',
              id: 3,
            },
          ],
          type: 'textValue',
          id: 0,
        },
      ],
      type: 'template',
    }
    const templateString = JSON.stringify(templateFixture)
    const tmb = new TemplateMessageBuilder(templateString)
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })
})

describe('testing add/remove text', () => {
  const tmb = new TemplateMessageBuilder()

  test('adds word', () => {
    tmb.addText('Hllo', 1, 0)
    const expectedResult = {
      value: [
        {
          value: [
            {
              value: 'Hllo',
              type: 'text',
              id: 1,
            },
          ],
          type: 'textValue',
          id: 0,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })

  test('adds char at index', () => {
    tmb.addText('e', 1, 1)
    const expectedResult = {
      value: [
        {
          value: [
            {
              value: 'Hello',
              type: 'text',
              id: 1,
            },
          ],
          type: 'textValue',
          id: 0,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })

  test('removes characters', () => {
    tmb.removeText(3, 1, 0)
    const expectedResult = {
      value: [
        {
          value: [
            {
              value: 'lo',
              type: 'text',
              id: 1,
            },
          ],
          type: 'textValue',
          id: 0,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })
  test('removes all', () => {
    tmb.removeText(999, 1, 0)
    const expectedResult = {
      value: [
        {
          value: [
            {
              value: '',
              type: 'text',
              id: 1,
            },
          ],
          type: 'textValue',
          id: 0,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })
})

describe('testing add/remove value', () => {
  const tmb = new TemplateMessageBuilder()

  test('add value', () => {
    tmb.addText('Hello, ', 1, 0)
    tmb.addValue('firstname', 1, 7)
    const expectedResult = {
      value: [
        {
          value: [
            {
              value: 'Hello, ',
              type: 'text',
              id: 2,
            },
            {
              value: 'firstname',
              type: 'value',
              id: 3,
            },
            {
              value: '',
              type: 'text',
              id: 4,
            },
          ],
          type: 'textValue',
          id: 0,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })

  test('add value to empty text block', () => {
    tmb.addValue('secondname', 4, 0)
    const expectedResult = {
      value: [
        {
          value: [
            {
              value: 'Hello, ',
              type: 'text',
              id: 2,
            },
            {
              value: 'firstname',
              type: 'value',
              id: 3,
            },
            {
              value: '',
              type: 'text',
              id: 5,
            },
            {
              value: 'secondname',
              type: 'value',
              id: 6,
            },
            {
              value: '',
              type: 'text',
              id: 7,
            },
          ],
          type: 'textValue',
          id: 0,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })

  test('remove value', () => {
    tmb.addValue('secondname', 4, 0)
    tmb.removeValue(6)
    const expectedResult = {
      value: [
        {
          value: [
            {
              value: 'Hello, ',
              type: 'text',
              id: 2,
            },
            {
              value: 'firstname',
              type: 'value',
              id: 3,
            },
            {
              value: '',
              type: 'text',
              id: 8,
            },
          ],
          type: 'textValue',
          id: 0,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })

  test('remove value without concatenation', () => {
    const template = {
      value: [
        {
          value: [
            {
              value: 'Hello, ',
              type: 'text',
            },
            {
              value: 'firstname',
              type: 'value',
            },
            {
              value: 'secondname',
              type: 'value',
            },
          ],
          type: 'textValue',
        },
      ],
      type: 'template',
    }
    const tmb = new TemplateMessageBuilder(JSON.stringify(template))
    tmb.removeValue(2)
    const expectedResult = {
      value: [
        {
          value: [
            {
              value: 'Hello, ',
              type: 'text',
              id: 1,
            },
            {
              value: 'secondname',
              type: 'value',
              id: 3,
            },
          ],
          type: 'textValue',
          id: 0,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })
})

describe('testing add/remove inThenElse', () => {
  const tmb = new TemplateMessageBuilder()
  test('add ifThenElse', () => {
    tmb.addText('Hello, Bill!\nBest regards,', 1, 0)
    tmb.addIfThenElse(1, 12)
    const expectedResult = {
      value: [
        {
          value: [
            {
              value: 'Hello, Bill!',
              type: 'text',
              id: 2,
            },
          ],
          type: 'textValue',
          id: 13,
        },
        {
          value: [
            {
              value: [
                {
                  value: '',
                  type: 'text',
                  id: 3,
                },
              ],
              type: 'if',
              id: 4,
            },
            {
              value: [
                {
                  value: [
                    {
                      value: '',
                      type: 'text',
                      id: 5,
                    },
                  ],
                  type: 'textValue',
                  id: 6,
                },
              ],
              type: 'thenElse',
              id: 7,
            },
            {
              value: [
                {
                  value: [
                    {
                      value: '',
                      type: 'text',
                      id: 8,
                    },
                  ],
                  type: 'textValue',
                  id: 9,
                },
              ],
              type: 'thenElse',
              id: 10,
            },
          ],
          type: 'ifThenElse',
          id: 11,
        },
        {
          value: [
            {
              value: '\nBest regards,',
              type: 'text',
              id: 12,
            },
          ],
          type: 'textValue',
          id: 14,
        },
      ],
      type: 'template',
    }
    // console.log(JSON.stringify(tmb.getTemplateAst(), null, 2))
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })

  test('remove ifThenElse', () => {
    tmb.removeIfThenElse(11)
    const expectedResult = {
      value: [
        {
          value: [
            {
              value: 'Hello, Bill!\nBest regards,',
              type: 'text',
              id: 15,
            },
          ],
          type: 'textValue',
          id: 16,
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
          value: [
            {
              value: 'Hello, Bill!',
              type: 'text',
            },
          ],
          type: 'textValue',
        },
        {
          value: [
            {
              value: [
                {
                  value: '',
                  type: 'text',
                },
              ],
              type: 'if',
            },
            {
              value: [
                {
                  value: [
                    {
                      value: '',
                      type: 'text',
                    },
                  ],
                  type: 'textValue',
                },
              ],
              type: 'thenElse',
            },
            {
              value: [
                {
                  value: [
                    {
                      value: '',
                      type: 'text',
                    },
                  ],
                  type: 'textValue',
                },
              ],
              type: 'thenElse',
            },
          ],
          type: 'ifThenElse',
        },
      ],
      type: 'template',
    }

    const tmb = new TemplateMessageBuilder(JSON.stringify(template))
    tmb.removeIfThenElse(2)

    const expectedResult = {
      value: [
        {
          value: [
            {
              value: 'Hello, Bill!',
              type: 'text',
              id: 1,
            },
          ],
          type: 'textValue',
          id: 0,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
  })

  test('remove ifThenElse without inner concatenation', () => {
    const template = {
      value: [
        {
          value: [
            {
              value: 'Hello, Bill!',
              type: 'text',
            },
          ],
          type: 'textValue',
        },
        {
          value: [
            {
              value: [
                {
                  value: '',
                  type: 'text',
                },
              ],
              type: 'if',
            },
            {
              value: [
                {
                  value: [
                    {
                      value: '',
                      type: 'text',
                    },
                  ],
                  type: 'textValue',
                },
              ],
              type: 'thenElse',
            },
            {
              value: [
                {
                  value: [
                    {
                      value: '',
                      type: 'text',
                    },
                  ],
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
              value: 'secondname',
              type: 'value',
            },
          ],
          type: 'textValue',
        },
      ],
      type: 'template',
    }

    const tmb = new TemplateMessageBuilder(JSON.stringify(template))
    tmb.removeIfThenElse(2)
    // console.log(JSON.stringify(tmb.getTemplateAst(), null, 2))

    const expectedResult = {
      value: [
        {
          value: [
            {
              value: 'Hello, Bill!',
              type: 'text',
              id: 1,
            },
            {
              value: 'secondname',
              type: 'value',
              id: 12,
            },
          ],
          type: 'textValue',
          id: 13,
        },
      ],
      type: 'template',
    }
    expect(tmb.getTemplateAst()).toEqual(expectedResult)
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
    const expectedResult = `Hello, Bill!

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
    const expectedResult = `Hello, Bill!

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
    const expectedResult = `Hello, Bill!

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
    const expectedResult = `Hello, Bill!

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
          value: [
            {
              value: 'Hello, Bill!\n',
              type: 'text',
            },
          ],
          type: 'textValue',
        },
        {
          value: [
            {
              value: [
                {
                  value: 'surname',
                  type: 'value',
                },
                {
                  value: 'true',
                  type: 'text',
                },
              ],
              type: 'if',
            },
            {
              value: [
                {
                  value: [
                    {
                      value: 'This text should be shown.',
                      type: 'text',
                    },
                  ],
                  type: 'textValue',
                },
              ],
              type: 'thenElse',
            },
            {
              value: [
                {
                  value: [
                    {
                      value: 'This text should not be shown.',
                      type: 'text',
                    },
                  ],
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
              value: '\nBest regards!',
              type: 'text',
            },
          ],
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
