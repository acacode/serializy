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

class YourModelDeclaration {
  clientProperty = fieldArray('Original_Property', 'string')
}

const YourModel = model(YourModelDeclaration)

console.log('YourModel', YourModel)

class ProfileDeclaration {
  badHabits = field(
      ({ DeepInfo }: any) => DeepInfo.BadHabits,
      ({ badHabits }) => ({ DeepInfo: { BadHabits: badHabits } })
    )
  family = field('Family', {
    childCount: field('ChildrenCount', 'number', 'string')({ readOnly: false, writeOnly: true }),
    spouse: field('Spouse', 'boolean')
  })
  id = field('ID')({ readOnly: true })
  job = field('Job', {
    experience: field('Exp', 'number'),
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

const NullableModel = model(class NullableModel {
  foo = field('Field', 'string')
})

console.log('nm', new NullableModel({ Field: null }).deserialize())

const SomeModel = model({
  prop1: field('Prop')({ writeOnly: true })
})

console.log(new SomeModel({ Prop: 'blabla ' }))

class AnimalD {
  age = field({
    name: 'Age',
    readOnly: true,
    type: 'number',
    writeOnly: true,
  })
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

const ObjectModel = model({
  someProp: field({
    name: 'SomeProps',
    readOnly: true,
    type: 'any',
    usageType: 'string'
  })
}, {
  warnings: false
})

const obj = new ObjectModel(null as any)

console.log('obj', obj.deserialize())

const DeepDeeperModel = model(class Deep1 {
  deep2 = field('Deep2', model(class Deep2 {
    deep3 = field('Deep3', model(class Deep3 {
      deep4 = field('Deep4', model(class Deep4 {
        deep5 = field('Deep5', model(class Deep5 {
          deep6 = field('Deep6', 'any')
        }))
      }))
    }))
  }))
})

console.log(JSON.stringify(new DeepDeeperModel({
  Deep2: {
    Deep3: {
      Deep4: {
        Deep5: {
          Deep6: '55'
        }
      }
    }
  }
}).deserialize()))

const Example2 = model(class {
  id = field('ID')({ readOnly: true })
  myProp = field('ID')({ writeOnly: true })
})

const clientModel = new Example2({ ID: '5' })

console.log('usage - ', clientModel) // { id: '5', myProp: '5' } - клиентская модель

clientModel.id = '6'
clientModel.myProp = '7'

console.log('original - ', clientModel.deserialize()) // { ID: '5' } - серверная модель
