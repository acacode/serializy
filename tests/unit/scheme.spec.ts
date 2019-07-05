
import { NAME_OF_CLASS_PROP, SchemeType, TYPE_OF_CLASS_PROP_VALUE } from '../../src/constants'
import { createSchemeFromOptions } from '../../src/scheme'

const invalidSchemeTest = (options: any) => {
  test(`should catch an exception because scheme is invalid (options: ${options.join(',')}`, () => {
    let catchedException = false
    try {
      createSchemeFromOptions({
        arrayType: false,
        options,
      })
    } catch (e) {
      catchedException = true
    }

    expect(catchedException).toEqual(true)
  })
}

describe('scheme', () => {

  describe('createSchemeFromOptions', () => {

    describe('1 argument', () => {
      describe('Property name', () => {
        test('should create a valid scheme', () => {
          const scheme = createSchemeFromOptions({
            arrayType: false,
            options: ['PropertyName']
          })

          expect(scheme).toStrictEqual({
            arrayType: false,
            from: {
              name: 'PropertyName',
              serializer: null,
              type: TYPE_OF_CLASS_PROP_VALUE,
            },
            schemeType: SchemeType.ONE_STRING,
            to: {
              name: NAME_OF_CLASS_PROP,
              serializer: null,
              type: TYPE_OF_CLASS_PROP_VALUE,
            },
          })
        })
      })
      describe('Custom serializer', () => {
        test('should create a valid scheme', () => {

          function customSerializer (): any { return null }
          const scheme = createSchemeFromOptions({
            arrayType: false,
            options: [customSerializer]
          })

          expect(typeof scheme.to.serializer).toEqual('function')
          delete scheme.to.serializer

          expect(scheme).toMatchObject({
            arrayType: false,
            from: {
              name: '',
              serializer: customSerializer,
              type: null,
            },
            schemeType: SchemeType.SERIALIZERS,
            to: {
              name: NAME_OF_CLASS_PROP,
              type: null,
            },
          })
        })

        invalidSchemeTest([null])
        invalidSchemeTest([100])
        invalidSchemeTest([true])
        invalidSchemeTest([{}])
      })
    })

    describe('2 arguments', () => {
      describe('Property name + Property type', () => {
        test('should create a valid scheme', () => {
          const scheme = createSchemeFromOptions({
            arrayType: false,
            options: ['PropertyName', 'string']
          })

          expect(scheme).toStrictEqual({
            arrayType: false,
            from: {
              name: 'PropertyName',
              serializer: null,
              type: 'string',
            },
            schemeType: SchemeType.TWO_STRINGS,
            to: {
              name: NAME_OF_CLASS_PROP,
              serializer: null,
              type: 'string',
            },
          })
        })

        invalidSchemeTest([null, null])
        invalidSchemeTest([100, 'sss'])
        invalidSchemeTest(['Prop', 100])
        invalidSchemeTest([{}, 1])
      })
      describe('Property name + Model class', () => {

        test('should create a valid scheme', () => {
          class SomeModelClass {}
          // const SomeModelClass = model(class SomeModelClass {})

          const scheme = createSchemeFromOptions({
            arrayType: false,
            options: ['PropertyName', SomeModelClass as any]
          })

          expect(scheme).toStrictEqual({
            arrayType: false,
            from: {
              name: 'PropertyName',
              serializer: null,
              type: SomeModelClass,
            },
            schemeType: SchemeType.STRING_AND_CLASS,
            to: {
              name: NAME_OF_CLASS_PROP,
              serializer: null,
              type: SomeModelClass,
            },
          })
        })
      })
      describe('Property name + Model simple object', () => {
        test('should create a valid scheme', () => {

          const scheme = createSchemeFromOptions({
            arrayType: false,
            options: ['PropertyName', {
              foo: 'bar',
            } as any]
          })

          expect(typeof scheme.from.type).toEqual('function')
          delete scheme.from.type

          expect(typeof scheme.to.type).toEqual('function')
          delete scheme.to.type

          expect(scheme).toStrictEqual({
            arrayType: false,
            from: {
              name: 'PropertyName',
              serializer: null,
            },
            schemeType: SchemeType.STRING_AND_CLASS,
            to: {
              name: NAME_OF_CLASS_PROP,
              serializer: null,
            },
          })
        })
      })
      describe('Custom serializer + Custom deserializer', () => {

        test('should create a valid scheme', () => {
          function customSerializer (): any { return null }
          function customDeserializer (): any { return null }

          const scheme = createSchemeFromOptions({
            arrayType: false,
            options: [customSerializer, customDeserializer]
          })

          // expect(typeof scheme.to.serializer).toEqual('function')
          // delete scheme.to.serializer

          expect(scheme).toMatchObject({
            arrayType: false,
            from: {
              name: '',
              serializer: customSerializer,
              type: null,
            },
            schemeType: SchemeType.SERIALIZERS,
            to: {
              name: NAME_OF_CLASS_PROP,
              serializer: customDeserializer,
              type: null,
            },
          })
        })
      })
    })

    describe('3 arguments', () => {

      describe('Property name + Property type + Property usage type',() => {
        test('should create a valid scheme', () => {
          const scheme = createSchemeFromOptions({
            arrayType: false,
            options: ['PropertyName', 'string', 'number']
          })

          expect(scheme).toStrictEqual({
            arrayType: false,
            from: {
              name: 'PropertyName',
              serializer: null,
              type: 'string',
            },
            schemeType: SchemeType.THREE_STRINGS,
            to: {
              name: NAME_OF_CLASS_PROP,
              serializer: null,
              type: 'number',
            },
          })
        })
      })
    })

  })
})
