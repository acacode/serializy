import { createMapper, prop, StructProp } from '../src'

// const Family = createMapper({
//   Children: ['children', 'number'],
// })

// const cc = UserInfo.toClient({
//   FirstName: 'Sergey',
//   LastName: 'Volkov',
// }) as any

// console.log('cc.firstName', cc.firstName)

createMapper({
  age: prop().from('Age', 'float').to('float'),
})

const lol = [
  new StructProp(['age', 'float'], ['Age','float']),
  new StructProp(['firstName'], ['FirstName']),
]

console.log('lol', lol, createMapper)
console.log('sas', lol[0].castTo('1234,5155', true))

console.log(prop().from('Age', 'float').to('float'))

class Creep {

}

class Monster {
  public hp = prop().from('HP', 'float')
  public level = prop().from('Level', 'integer')

  public fullName = prop()
    .from((model) => `${model.FirstName} ${model.LastName}`)
    .to((model) => {
      const [FirstName, LastName] = model.fullName.split(' ')
      return {
        FirstName,
        LastName
      }
    })

  public creeps = prop('array').of(Creep)
}
