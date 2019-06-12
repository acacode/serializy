import {
  from,
  // fromArray,
  fromArray,
  mapy
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
  //   foo = from('Foo', 'number', 'number')
  //   bar = from('Bar', 'number', 'number')
  //   baz = from(({ Foo, Bar }: any) => `${Foo} - ${Bar}`)
  // }
  // const FooBarCountModel = mapy(FooBarCountDeclaration)

  // class FamilyDeclaration {
  //   childCount = from('ChildrenCount', 'float')
  //   spouse = from('Spouse', 'boolean')
  //   count = from('Count')
  //   superCount = from('SuperCount', 'string', 'number')
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
    childCount = from('ChildrenCount', 'number')
    spouse = from('Spouse', 'boolean')
  }
  const FamilyModel = mapy(FamilyDeclaration)

  class JobDeclaration {
    experience = from('Exp', 'integer')
    skills = from(({ Skills }: any) => Skills)
  }
  const JobModel = mapy(JobDeclaration)

  class LanguageDeclaration {
    id = from('ID', 'string')
    name = from('Name', 'string')
  }

  const LanguageModel = mapy(LanguageDeclaration)

  class ProfileDeclaration {
    badHabits = from(({ DeepInfo }: any) => DeepInfo.BadHabits)
    family = from('Family', FamilyModel)
    id = from('ID')
    job = from('Job', JobModel)
    languages = fromArray('Languages', LanguageModel)
    personalInfo = from((originalModel: any) => ({
      firstName: originalModel.FirstName,
      fullName: `${originalModel.FirstName} ${originalModel.LastName}`,
      lastName: originalModel.LastName,
    }))
  }

  const ProfileModel = mapy(ProfileDeclaration)

  console.log(ProfileModel.makeFrom(ServerData))

}, 5000)
