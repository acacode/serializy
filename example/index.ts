import {
  field,
  // fromArray,
  fieldArray,
  makeModel
} from '../src'

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

// const ClientData = {
//   badHabits: ['Coffee', 'Development'],
//   family: {
//     childCount: 0,
//     spouse: false,
//   },
//   firstName: 'Sergey',
//   id: '1CASSD@D#@Dd2d@2dDFC',
//   job: {
//     experience: 4,
//     skills: ['JavaScript', 'ReactJS', 'NodeJS']
//   },
//   languages: [
//     { id: '1', name: 'English' },
//     { id: '2', name: 'Russian' },
//   ],
//   lastName: 'Volkov',
// }

setInterval(() => {

  // class FooBarCountDeclaration {
  //   foo = field('Foo', 'number', 'number')
  //   bar = field('Bar', 'number', 'number')
  //   baz = field(({ Foo, Bar }: any) => `${Foo} - ${Bar}`)
  // }
  // const FooBarCountModel = mapy(FooBarCountDeclaration)

  // class FamilyDeclaration {
  //   childCount = field('ChildrenCount', 'float')
  //   spouse = field('Spouse', 'boolean')
  //   count = field('Count')
  //   superCount = field('SuperCount', 'string', 'number')
  //   fooBarCount = fromArray('FooBar', FooBarCountModel)
  // }

  // const FamilyModel = mapy(FamilyDeclaration)

  // console.log(FamilyModel.makeFrom({
  //   ChildrenCount: 123.44,
  //   Count: 500,
  //   FooBar: [
  //     {
  //       Bar: 600,
  //       Foo: 500,
  //     },
  //     {
  //       Bar: 5600,
  //       Foo: 400,
  //     }
  //   ],
  //   Spouse: false,
  //   SuperCount: '1234.500',
  // }))

  class FamilyDeclaration {
    childCount = field('ChildrenCount', 'number')
    spouse = field('Spouse', 'boolean')
  }
  const FamilyModel = makeModel(FamilyDeclaration)

  class JobDeclaration {
    experience = field('Exp', 'integer')
    skills = field(({ Skills }: any) => Skills)
  }
  const JobModel = makeModel(JobDeclaration)

  class LanguageDeclaration {
    id = field('ID', 'string')
    name = field('Name', 'string')
  }

  const LanguageModel = makeModel(LanguageDeclaration)

  class ProfileDeclaration {
    badHabits = field(({ DeepInfo }: any) => DeepInfo.BadHabits)
    family = field('Family', FamilyModel)
    id = field('ID')
    job = field('Job', JobModel)
    languages = fieldArray('Languages', LanguageModel)
    personalInfo = field((originalModel: any) => ({
      firstName: originalModel.FirstName,
      fullName: `${originalModel.FirstName} ${originalModel.LastName}`,
      lastName: originalModel.LastName,
    }))
  }

  const ProfileModel = makeModel(ProfileDeclaration)

  console.log(ProfileModel.makeFrom(ServerData))

}, 5000)
