import { createMapper } from '../src'

const mapy = createMapper({
  bar: 'foo',
  foo: 'bar',
})

console.log(mapy.toClient({
  bar: '1231233',
  foo: '1234',
})
)
