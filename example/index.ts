import { createMapper } from '../src'

const Family = createMapper({
  Children: ['children', 'number'],
})

const UserInfo = createMapper({
  Age: ['age', 'number'],
  Family,
  FirstName: 'firstName',
  LastName: ['lastName', 'string'],
})

const cc = UserInfo.toClient({
  FirstName: 'Sergey',
  LastName: 'Volkov',
}) as any

console.log('cc.firstName', cc.firstName)
