import { TemplateRepositoryDb } from '../ports/TemplateRepositoryDb.interface'

const ARR_VAR_NAMES_KEY = 'arrVarNames'
const TEMPLATE_KEY = 'template'

export const templateDb: TemplateRepositoryDb = {
  getArrVarNames: async () => {
    const result = localStorage.getItem(ARR_VAR_NAMES_KEY)
    if (result === null) throw new Error('arrVarNames not found')
    return JSON.parse(result)
  },
  setArrVarNames: async (arrVarNames) => {
    try {
      localStorage.setItem(ARR_VAR_NAMES_KEY, JSON.stringify(arrVarNames))
    } catch (error) {
      throw error
    }
  },

  getTemplate: async () => {
    const result = localStorage.getItem(TEMPLATE_KEY)
    if (result === null) throw new Error('template not found')
    return result
  },

  setTemplate: async (template) => {
    try {
      localStorage.setItem(TEMPLATE_KEY, template)
    } catch (error) {
      throw error
    }
  },
}
