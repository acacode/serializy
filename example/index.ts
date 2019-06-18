import {
  createModel,
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

  const FamilyModel = createModel(class FamilyModel {
    childCount = field('ChildrenCount', 'number', 'string')
    spouse = field('Spouse', 'boolean')
  })

  const JobModel = createModel(class JobModel {
    experience = field('Exp', 'integer')
    skills = field(({ Skills }: any) => Skills).to(({ skills }) => ({ Skills: skills }))
  })

  const LanguageModel = createModel(class LanguageModel {
    id = field('ID', 'string')
    name = field('Name', 'string')
  })

  class ProfileDeclaration {
    badHabits = field(({ DeepInfo }: any) => DeepInfo.BadHabits)
      .to(({ badHabits }) => ({ DeepInfo: { BadHabits: badHabits } }))
    family = field('Family', FamilyModel)
    id = field('ID')
    job = field('Job', JobModel)
    languages = fieldArray('Languages', LanguageModel)
    personalInfo = field((originalModel: any) => ({
      firstName: originalModel.FirstName,
      fullName: `${originalModel.FirstName} ${originalModel.LastName}`,
      lastName: originalModel.LastName,
    })).to(({ personalInfo }) => ({
      FirstName: personalInfo.firstName,
      LastName: personalInfo.lastName,
    }))

    getFullName = () => (this.personalInfo as any).firstName
  }

  const ProfileModel = createModel(ProfileDeclaration)

  const profile = new ProfileModel(ServerData)

  profile.personalInfo.firstName = 'Sergey'
  profile.personalInfo.lastName = 'Volkov'

  profile.id = `${profile.id}_CHANGED`

  console.log(profile.convertToOriginal())

}, 1000)
