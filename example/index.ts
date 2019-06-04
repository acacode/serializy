import { createMapper } from '../src'

setTimeout(() => {

  const mapy = createMapper({
    firstName: 'FirstName',
    lastName: 'LastName',
  })

  const cc = mapy.toClient({
    FirstName: 'Sergey',
    LastName: 'Volkov',
  }) as any

  console.log('cc.firstName', cc.firstName)

}, 14000)
