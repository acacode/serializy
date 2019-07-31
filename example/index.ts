import { field, fieldArray, model } from '../src'

const ServerData = {
  DeepInfo: {
    BadHabits: ['Coffee', 'Development']
  },
  Family: {
    ChildrenCount: 0,
    Spouse: false
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
      Name: 'English'
    },
    {
      ID: '2',
      Name: 'Russian'
    }
  ],
  LastName: 'Volkov'
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
    childCount: field('ChildrenCount', 'number', 'string')({
      optional: false
    }),
    spouse: field('Spouse', 'boolean')
  })
  id = field('ID')({ optional: true })
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
      lastName: LastName
    }),
    ({ personalInfo }) => ({
      FirstName: personalInfo.firstName,
      LastName: personalInfo.lastName
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

const SomeModel = model({
  prop1: field('Prop')
})

console.log(new SomeModel({ Prop: 'blabla ' }))

class AnimalD {
  age = field({
    name: 'Age',
    optional: true,
    type: 'number'
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

const DeepDeeperModel = model(
  class Deep1 {
    deep2 = field(
      'Deep2',
      model(
        class Deep2 {
          deep3 = field(
            'Deep3',
            model(
              class Deep3 {
                deep4 = field(
                  'Deep4',
                  model(
                    class Deep4 {
                      deep5 = field(
                        'Deep5',
                        model(
                          class Deep5 {
                            deep6 = field('Deep6', 'any')
                          }
                        )
                      )
                    }
                  )
                )
              }
            )
          )
        }
      )
    )
  }
)

console.log(
  JSON.stringify(
    new DeepDeeperModel({
      Deep2: {
        Deep3: {
          Deep4: {
            Deep5: {
              Deep6: '55'
            }
          }
        }
      }
    }).deserialize()
  )
)

const ObjectModel = model(
  {
    someProp: field({
      name: 'SomeProps',
      optional: true,
      type: 'any',
      usageType: 'string'
    })
  },
  {
    warnings: false
  }
)

const obj = new ObjectModel({
  SomeProps: 213123123123
})

console.log('obj', obj)
console.log('obj', obj.deserialize())

const Example2 = model(
  class {
    id = field('ID')({ optional: true })
    myProp = field('PROP')
  }
)

const clientModel = new Example2({ PROP: 'PROP' })

console.log('usage - ', clientModel) // { id: '5' } - то чем будет руководствоваться клиент

clientModel.id = '6'
clientModel.myProp = '7'

console.log('original - ', clientModel.deserialize()) // { PROP: '7' } - то что уйдет на сервак
console.log('original - ', Example2.deserialize(clientModel)) // { PROP: '7' } - то что уйдет на сервак

const exampleCase = () => {
  const NullableModel = model(
    class NullableModel {
      foo = field('Field', 'string')
    }
  )

  const nullableModel = new NullableModel({})

  console.log(nullableModel)
  console.log(nullableModel.deserialize())
}

setTimeout(exampleCase, 8000)
