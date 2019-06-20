import {
  field,
  fieldArray,
  model
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

  // const FamilyModel = model(class FamilyModel {
  //   childCount = field('ChildrenCount', 'number', 'string')
  //   spouse = field('Spouse', 'boolean')
  // })

  const FamilyModel = model({
    childCount: field('ChildrenCount', 'number', 'string'),
    spouse: field('Spouse', 'boolean')
  })

  const JobModel = model(class JobModel {
    experience = field('Exp', 'integer')
    skills = field(
      ({ Skills }) => Skills,
      ({ skills }) => ({ Skills: skills })
    )
  })

  class ProfileDeclaration {
    badHabits = field(
      ({ DeepInfo }: any) => DeepInfo.BadHabits,
      ({ badHabits }) => ({ DeepInfo: { BadHabits: badHabits } })
    )
    family = field('Family', FamilyModel)
    id = field('ID')
    job = field('Job', JobModel)
    languages = fieldArray('Languages', {
      id: field('ID', 'string'),
      name: field('Name', 'string')
    })
    // languages = fieldArray('Languages', model(class Language {
    //   id = field('ID', 'string')
    //   name = field('Name', 'string')
    // }))
    personalInfo = field(
      ({ FirstName, LastName }) => ({
        firstName: FirstName,
        fullName: `${FirstName} ${LastName}`,
        lastName: LastName,
      }),
      ({ personalInfo }) => ({
        FirstName: personalInfo.firstName,
        LastName: personalInfo.lastName,
      })
    )

    getFullName = () => (this.personalInfo as any).firstName
  }

  const ProfileModel = model(ProfileDeclaration)

  const profile = new ProfileModel(ServerData)

  profile.personalInfo.firstName = 'Sergey'
  profile.personalInfo.lastName = 'Volkov'

  profile.id = `${profile.id}_CHANGED`

  console.log(profile.deserialize())

}, 7000)
