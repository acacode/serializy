
const ServerData = {
  DeepInfo: {
    BadHabits: ['Coffee', 'Development']
  },
  Family: {
    ChildrenCount: 0,
    Spouse: false,
  },
  FirstName: 'Sergey',
  ID: '1CASSD@D#@Dd2d@2dDFC',
  Job: {
    Exp: 4,
    Skills: ['JavaScript', 'ReactJS', 'NodeJS']
  },
  Languages: [
    {
      ID: '1',
      Name: 'English',
    },
    {
      ID: '2',
      Name: 'Russian',
    },
  ],
  LastName: 'Volkov',
}

const ClientData = {
  badHabits: ['Coffee', 'Development'],
  family: {
    childCount: 0,
    spouse: false,
  },
  firstName: 'Sergey',
  id: '1CASSD@D#@Dd2d@2dDFC',
  job: {
    experience: 4,
    skills: ['JavaScript', 'ReactJS', 'NodeJS']
  },
  languages: [
    { id: '1', name: 'English' },
    { id: '2', name: 'Russian' },
  ],
  lastName: 'Volkov',
}

declare interface PropDeclaration {
  '@@property_declaration': true
}

declare interface Declaration {
  [prop: string]: PropDeclaration
}

const createPropDeclaration = (): PropDeclaration => ({
  '@@property_declaration': true
})

const makeModel = (declaration: new () => Declaration) => null

const from = (...args: any[]): PropDeclaration => createPropDeclaration()
const fromArray = (...args: any[]): PropDeclaration => createPropDeclaration()

const connectMapster = (...args: any[]) => null

class FamilyDeclaration {
  childCount = from('ChildrenCount', 'float')
  spouse = from('Spouse', 'boolean')
}
const FamilyModel = makeModel(FamilyDeclaration)

class JobDeclaration {
  experience = from('Exp', 'integer')
  skills = from('Skills')
}
const JobModel = makeModel(JobDeclaration)

class LanguageDeclaration {
  id = from('ID', 'string')
  name = from('Name', 'string')
}
const LanguageModel = makeModel(LanguageDeclaration)

class ProfileDeclaration {
  badHabits = from(({ DeepInfo }) => DeepInfo.BadHabits)
  family = from('Family', FamilyModel)
  firstName = from('FirstName')
  id = from('ID')
  job = from('Job', JobModel)
  lastName = from('LastName')
  languages = fromArray('Languages', LanguageModel)
  personalInfo = from(({ FirstName, LastName }) => ({
    firstName: FirstName,
    fullName: `${FirstName} ${LastName}`,
    lastName: LastName,
  })).to((usageModel, originalModel) => ({
    ...originalModel,
    FirstName: usageModel.personalInfo.firstName,
    LastName: usageModel.personalInfo.lastName,
  }))
}
