import { EMPTY_NAME, SchemeType } from '../../src/constants'
import { createSchemeFromOptions } from '../../src/scheme'
import { mockConsole } from './__helpers__'

const invalidSchemeTest = (options: any) => {
  test(`should catch an exception because scheme is invalid (options: ${JSON.stringify(
    options
  )}`, () => {
    let catchedException = false
    try {
      createSchemeFromOptions({
        arrayType: false,
        optional: false,
        options
      })
    } catch (e) {
      catchedException = true
    }

    expect(catchedException).toEqual(true)
  })
}

describe('scheme', () => {
  mockConsole(true)

  describe('createSchemeFromOptions', () => {
    describe('1 argument', () => {
      invalidSchemeTest([null])
      invalidSchemeTest([100])
      invalidSchemeTest([true])
      invalidSchemeTest([{}])

      describe('Property name', () => {
        test('should create a valid scheme', () => {
          const scheme = createSchemeFromOptions({
            arrayType: false,
            optional: false,
            options: ['PropertyName']
          })

          expect(scheme).toStrictEqual({
            arrayType: false,
            from: {
              name: 'PropertyName',
              serializer: null,
              type: 'any'
            },
            optional: false,
            schemeType: SchemeType.STRINGS,
            to: {
              name: EMPTY_NAME,
              serializer: null,
              type: 'any'
            }
          })
        })
      })
      describe('Custom serializer', () => {
        test('should create a valid scheme', () => {
          function customSerializer(): any {
            return null
          }
          const scheme = createSchemeFromOptions({
            arrayType: false,
            optional: false,
            options: [customSerializer]
          })

          expect(typeof scheme.to.serializer).toEqual('function')
          delete scheme.to.serializer

          expect(scheme).toMatchObject({
            arrayType: false,
            from: {
              name: '',
              serializer: customSerializer,
              type: null
            },
            optional: false,
            schemeType: SchemeType.SERIALIZERS,
            to: {
              name: EMPTY_NAME,
              type: null
            }
          })
        })
      })
      describe('Field configuration', () => {
        test('should create a valid scheme', () => {
          const scheme = createSchemeFromOptions({
            arrayType: false,
            optional: false,
            options: [
              {
                name: 'Blabla',
                optional: true
              }
            ]
          })

          expect(scheme).toMatchObject({
            arrayType: false,
            from: {
              name: 'Blabla',
              serializer: null,
              type: 'any'
            },
            optional: true,
            schemeType: SchemeType.STRINGS,
            to: {
              name: EMPTY_NAME,
              type: 'any'
            }
          })
        })
      })
    })

    describe('2 arguments', () => {
      invalidSchemeTest([null, null])
      invalidSchemeTest([100, 'sss'])
      invalidSchemeTest(['Prop', 100])
      invalidSchemeTest([{}, 1])

      describe('Property name + Property type', () => {
        test('should create a valid scheme', () => {
          const scheme = createSchemeFromOptions({
            arrayType: false,
            optional: false,
            options: ['PropertyName', 'string']
          })

          expect(scheme).toStrictEqual({
            arrayType: false,
            from: {
              name: 'PropertyName',
              serializer: null,
              type: 'string'
            },
            optional: false,
            schemeType: SchemeType.STRINGS,
            to: {
              name: EMPTY_NAME,
              serializer: null,
              type: 'string'
            }
          })
        })
      })
      describe('Property name + Model class', () => {
        test('should create a valid scheme', () => {
          class SomeModelClass {}
          // const SomeModelClass = model(class SomeModelClass {})

          const scheme = createSchemeFromOptions({
            arrayType: false,
            optional: false,
            options: ['PropertyName', SomeModelClass as any]
          })

          expect(scheme).toStrictEqual({
            arrayType: false,
            from: {
              name: 'PropertyName',
              serializer: null,
              type: SomeModelClass
            },
            optional: false,
            schemeType: SchemeType.STRING_AND_CLASS,
            to: {
              name: EMPTY_NAME,
              serializer: null,
              type: SomeModelClass
            }
          })
        })
      })
      describe('Property name + Model simple object', () => {
        test('should create a valid scheme', () => {
          const scheme = createSchemeFromOptions({
            arrayType: false,
            optional: false,
            options: [
              'PropertyName',
              {
                foo: 'bar'
              } as any
            ]
          })

          expect(typeof scheme.from.type).toEqual('function')
          delete scheme.from.type

          expect(typeof scheme.to.type).toEqual('function')
          delete scheme.to.type

          expect(scheme).toStrictEqual({
            arrayType: false,
            from: {
              name: 'PropertyName',
              serializer: null
            },
            optional: false,
            schemeType: SchemeType.STRING_AND_CLASS,
            to: {
              name: EMPTY_NAME,
              serializer: null
            }
          })
        })
      })
      describe('Custom serializer + Custom deserializer', () => {
        test('should create a valid scheme', () => {
          function customSerializer(): any {
            return null
          }
          function customDeserializer(): any {
            return null
          }

          const scheme = createSchemeFromOptions({
            arrayType: false,
            optional: false,
            options: [customSerializer, customDeserializer]
          })

          // expect(typeof scheme.to.serializer).toEqual('function')
          // delete scheme.to.serializer

          expect(scheme).toMatchObject({
            arrayType: false,
            from: {
              name: '',
              serializer: customSerializer,
              type: null
            },
            schemeType: SchemeType.SERIALIZERS,
            to: {
              name: EMPTY_NAME,
              serializer: customDeserializer,
              type: null
            }
          })
        })
      })
    })

    describe('3 arguments', () => {
      invalidSchemeTest(['', '', ''])
      invalidSchemeTest([123125, null, ''])

      describe('Property name + Property type + Property usage type', () => {
        test('should create a valid scheme', () => {
          const scheme = createSchemeFromOptions({
            arrayType: false,
            optional: false,
            options: ['PropertyName', 'string', 'number']
          })

          expect(scheme).toStrictEqual({
            arrayType: false,
            from: {
              name: 'PropertyName',
              serializer: null,
              type: 'string'
            },
            optional: false,
            schemeType: SchemeType.STRINGS,
            to: {
              name: EMPTY_NAME,
              serializer: null,
              type: 'number'
            }
          })
        })
      })
    })
  })
})
