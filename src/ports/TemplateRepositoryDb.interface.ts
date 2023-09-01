export interface TemplateRepositoryDb {
  getArrVarNames: () => Promise<Array<string>>
  setArrVarNames: (arrVarNames: Array<string>) => Promise<void>
  getTemplate: () => Promise<string>
  setTemplate: (template: string) => Promise<void>
}
