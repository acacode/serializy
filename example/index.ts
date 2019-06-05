import { createMapper } from '../src'

const Family = createMapper({
  Children: ['children', Number],
})

const UserInfo = createMapper({
  Age: ['age', Number],
  Family,
  FirstName: 'firstName',
  LastName: ['lastName', String],
})

const cc = UserInfo.toClient({
  FirstName: 'Sergey',
  LastName: 'Volkov',
}) as any

console.log('cc.firstName', cc.firstName)
