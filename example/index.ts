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

  class ProfileDeclaration {
    badHabits = field(
      ({ DeepInfo }: any) => DeepInfo.BadHabits,
      ({ badHabits }) => ({ DeepInfo: { BadHabits: badHabits } })
    )
    family = field('Family', {
      childCount: field('ChildrenCount', 'number', 'string'),
      spouse: field('Spouse', 'boolean')
    })
    id = field('ID')
    job = field('Job', {
      experience: field('Exp', 'integer'),
      skills: fieldArray('Skills', 'string')
    })
    languages = fieldArray('Languages', {
      id: field('ID', 'string'),
      name: field('Name', 'string')
    })
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

  const OddModel = model({
    prop1: field('Prop')
  })

  console.log(new OddModel({ Prop: 'blabla ' }))

  class AnimalD {
    age = field('Age', 'number')
    name = field('Name', 'string')
  }

  class DogD extends AnimalD {
    breed = field('Breed', 'string')
  }

  const DogModel = model(DogD)

  const dog = new DogModel({
    Age: 4,
    Breed: 'scottish terrier',
    Name: 'Fluffy'
  })

  console.log(dog)
  /*
  {
    age: 4,
    breed: 'scottish terrier',
    name: 'Fluffy'
  }
  */

}, 2000)
