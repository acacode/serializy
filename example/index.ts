import {
  createModel,
  // fromArray,
  field,
  fieldArray
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

setInterval(() => {

  class FamilyDeclaration {
    childCount = field('ChildrenCount', 'number')
    spouse = field('Spouse', 'boolean')
  }
  const FamilyModel = createModel(FamilyDeclaration)

  class JobDeclaration {
    experience = field('Exp', 'integer')
    skills = field(({ Skills }: any) => Skills).to(({ skills }) => skills)
  }
  const JobModel = createModel(JobDeclaration)

  class LanguageDeclaration {
    id = field('ID', 'string')
    name = field('Name', 'string')
  }

  const LanguageModel = createModel(LanguageDeclaration)

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

  const ProfileModel = createModel(ProfileDeclaration)

  const profile = new ProfileModel(ServerData)

  profile.id = `${profile.id}_CHANGED`

  const family = new FamilyModel({
    ChildrenCount: 40,
    Spouse: false,
  })

  --family.childrenCount

  console.log('family', family.convertToOriginal())

  // console.log('profile.id', profile.id)

  // profile.convertToOriginal()

}, 5000)
