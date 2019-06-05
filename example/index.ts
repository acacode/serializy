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
