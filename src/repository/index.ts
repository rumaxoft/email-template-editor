import { TemplateRepository } from './TemplateRepository'

import { templateDb } from '../db/templateDb'
import { TemplateRepositoryDb } from '../ports/TemplateRepositoryDb.interface'

const delayDec = (f: Function, delay = 200) => {
  return async (...args: any[]) => {
    await new Promise((resolve) => setTimeout(resolve, delay))
    return f(...args)
  }
}

const delayDb = (db: TemplateRepositoryDb, delay = 200) => {
  let key: keyof TemplateRepositoryDb
  for (key in db) {
    if (key in db) {
      db[key] = delayDec(db[key], delay)
    }
  }
  return db
}

const delayedDb = delayDb(templateDb, 1000)

const templateRepository = new TemplateRepository(delayedDb)

export default templateRepository
