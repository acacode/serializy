
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
  '@@array_property_declaration': boolean
  '@@property_declaration': true,

  to?: (modifyFunc: (usageModel: any, originalModel: any) => object) => PropDeclaration
}

declare interface PropDeclarationConfiguration<M extends object = any> {
  '@@array_property_declaration'?: boolean
  options: FromAnyDeclaration<M> | FromArrayDeclaration
}

const createPropDeclaration = <M extends object = any>(
  config: PropDeclarationConfiguration<M>
): PropDeclaration => {

  const propDeclaration: PropDeclaration = {
    '@@array_property_declaration': !!config['@@array_property_declaration'],
    '@@property_declaration': true,
  }

  const scheme = {
    from: [],
    to: [],
  }

  const [option1,option2,option3] = config.options

  // 1, 2, 4, 3, 5-6, 7

  if (config.options.length === 1) {

    // here we have one string - name of original property
    if (typeof option1 === 'string') {
      // TODO: 1 case
    }

    // specified for complex declarations using function
    if (typeof option1 === 'function') {
      // TODO: 5-6 case
      propDeclaration.to = (modifyFunc: (usageModel: any, originalModel: any) => object) => {
        // TODO: process modify handler
        return propDeclaration
      }
    }
  }

  if (config.options.length === 2) {

    if (typeof option1 === 'string') {

      // here we have a couple strings where
      // first string - name of original property
      // second string - type which we want to cast
      if (typeof option2 === 'string') {
        // TODO: 2 case
      }

      if (typeof option2 === 'object') {
        if (propDeclaration['@@array_property_declaration']) {
          // TODO: 7 case
        } else {
          // TODO: 4 case
        }
      }
    }
  }

  if (config.options.length === 3) {

    // here we have a three strings where
    // first string - name of original property
    // second string - type which we want to cast
    // third string - type which we want to convert where we will prepare model to server
    if (typeof option1 === 'string' && typeof option2 === 'string' && typeof option3 === 'string') {
      // TODO: 3 case
    }
  }

  return propDeclaration
}

type ValueOf<T> = T[keyof T]

const makeModel = <T = any>(declaration: T): ValueOf<T> => {
  // @ts-ignore
  const DeclaredModel = new (declaration as (new () => ValueOf<T>))()
  console.log('declaration', declaration)
  return DeclaredModel
}

declare type FromAnyDeclaration<M extends object> =
  [string, string?, string?]
  | [string, object] // :TODO replace object to TYPE
  | [(originalModel: M) => object] // :TODO replace object to TYPE

declare type FromArrayDeclaration =
  [string, object]

const from = <M extends object = any>(...args: FromAnyDeclaration<M>) =>
  createPropDeclaration<M>({
    options: args,
  })

const fromArray = (...args: FromArrayDeclaration) =>
  createPropDeclaration({
    '@@array_property_declaration': true,
    options: args,
  })

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
    .to((usageModel, originalModel) => ({
      ...originalModel,
      DeepInfo: {
        ...originalModel.DeepInfo,
        BadHabits: usageModel.badHabits,
      },
    }))
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
