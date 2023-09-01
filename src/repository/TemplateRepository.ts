import { TemplateRepositoryDb } from '../ports/TemplateRepositoryDb.interface'
export class TemplateRepository {
  db: TemplateRepositoryDb

  constructor(db: TemplateRepositoryDb) {
    this.db = db
  }

  async getArrVarNames() {
    try {
      const result = await this.db.getArrVarNames()
      return result
    } catch (error) {
      return null
    }
  }

  async setArrVarNames(arrVarNames: Array<string>) {
    try {
      await this.db.setArrVarNames(arrVarNames)
      return true
    } catch (error) {
      return null
    }
  }

  async getTemplate() {
    try {
      const result = await this.db.getTemplate()
      return result
    } catch (error) {
      return null
    }
  }

  async setTemplate(template: string) {
    try {
      await this.db.setTemplate(template)
      return true
    } catch (error) {
      return null
    }
  }
}
