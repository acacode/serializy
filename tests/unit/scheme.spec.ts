
import { NAME_OF_CLASS_PROP, SchemeType, TYPE_OF_CLASS_PROP_VALUE } from '../../src/constants'
import { ModelWrapper } from '../../src/model_wrapper'
import { createSchemeFromOptions } from '../../src/scheme'

describe('scheme', () => {

  describe('createSchemeFromOptions', () => {

    describe('1 argument', () => {
      test('Property name', () => {
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
      test('Custom serializer', () => {

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
    })

    describe('2 arguments', () => {
      test('Property name + Property type', () => {
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
      test('Property name + Model', () => {

        // const SomeModelClass = model(class SomeModelClass {})

        const scheme = createSchemeFromOptions({
          arrayType: false,
          options: ['PropertyName', SomeModelClass as ModelWrapper<any>]
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
    })

  })
})
