import { model } from '../../src'
import { SchemeType } from '../../src/constants'
import { convertModel } from '../../src/converter'
import { createField } from '../../src/field_declaration'
import { ModelOptions } from '../../src/model_wrapper'
import { PropDeclaration } from '../../src/prop_declaration'
import { mockConsole } from './__helpers__'

describe('converter', () => {
  mockConsole(true)

  describe('convertModel', () => {
    test('should be function', () => {
      expect(typeof convertModel).toBe('function')
    })

    test('should successfuly convert scheme with type SchemeType.STRINGS to usage', () => {
      const declarations: PropDeclaration[] = [
        {
          '@@property_declaration': true,
          scheme: {
            arrayType: false,
            from: {
              name: 'Test',
              serializer: null,
              type: 'any'
            },
            optional: false,
            schemeType: SchemeType.STRINGS,
            to: {
              name: 'test',
              serializer: null,
              type: 'any'
            }
          }
        }
      ]
      const options: ModelOptions = {
        defaultValues: false,
        warnings: true
      }

      expect(
        convertModel(
          { Test: 'test' },
          {
            declarations,
            options
          },
          false
        )
      ).toMatchObject({
        test: 'test'
      })
      expect(
        convertModel(
          {
            test: 'test'
          },
          {
            declarations,
            options
          },
          true
        )
      ).toMatchObject({ Test: 'test' })
    })
    test('should successfuly convert scheme with type SchemeType.STRING_AND_CLASS to usage', () => {
      const fooModel = model(
        class {
          foo = createField('Foo')
        }
      )
      const declarations: PropDeclaration[] = [
        {
          '@@property_declaration': true,
          scheme: {
            arrayType: false,
            from: {
              name: 'Test',
              serializer: null,
              type: fooModel
            },
            optional: false,
            schemeType: SchemeType.STRING_AND_CLASS,
            to: {
              name: 'test',
              serializer: null,
              type: fooModel
            }
          }
        }
      ]
      const options: ModelOptions = {
        defaultValues: false,
        warnings: true
      }
      expect(
        convertModel(
          {
            Test: {
              Foo: 'bar'
            }
          },
          {
            declarations,
            options
          },
          false
        )
      ).toMatchObject({
        test: {
          foo: 'bar'
        }
      })
      expect(
        convertModel(
          {
            test: {
              foo: 'bar'
            }
          },
          {
            declarations,
            options
          },
          true
        )
      ).toMatchObject({
        Test: {
          Foo: 'bar'
        }
      })
    })
    test('should successfuly convert scheme with type SchemeType.SERIALIZERS to usage', () => {
      const declarations: PropDeclaration[] = [
        {
          '@@property_declaration': true,
          scheme: {
            arrayType: false,
            from: {
              name: 'Test',
              serializer: ({ Test }: any) => {
                return Test.Foo
              },
              type: null
            },
            optional: false,
            schemeType: SchemeType.SERIALIZERS,
            to: {
              name: 'test',
              serializer: ({ test }: any) => {
                return { Test: { Foo: test } }
              },
              type: null
            }
          }
        }
      ]
      const options: ModelOptions = {
        defaultValues: false,
        warnings: true
      }

      expect(
        convertModel(
          {
            Test: {
              Foo: 'bar'
            }
          },
          {
            declarations,
            options
          },
          false
        )
      ).toMatchObject({
        test: 'bar'
      })
      expect(
        convertModel(
          {
            test: 'bar'
          },
          {
            declarations,
            options
          },
          true
        )
      ).toMatchObject({
        Test: {
          Foo: 'bar'
        }
      })
    })
  })
})
