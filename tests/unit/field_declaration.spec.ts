import { createField, createFieldsArray } from '../../src/field_declaration'
import { mockConsole } from './__helpers__'

describe('field_declaration', () => {
  mockConsole(true)

  describe('createField', () => {
    test('should be function', () => {
      expect(typeof createField).toBe('function')
    })
    test('returned value should be function', () => {
      expect(typeof createField('Foo', 'any', 'boolean')).toBe('function')
    })

    test('should create valid field declaration', () => {
      expect(
        createField('Foo', 'any', 'boolean')({ optional: true })
      ).toStrictEqual({
        '@@property_declaration': true,
        scheme: {
          arrayType: false,
          from: {
            name: 'Foo',
            serializer: null,
            type: 'any'
          },
          optional: true,
          schemeType: '@STRINGS',
          to: {
            name: '@@EMPTY_NAME',
            serializer: null,
            type: 'boolean'
          }
        }
      })
    })
  })
  describe('createFieldsArray', () => {
    test('should be function', () => {
      expect(typeof createFieldsArray).toBe('function')
    })
    test('returned value should be function', () => {
      expect(typeof createFieldsArray('Foo', 'any')).toBe('function')
    })
    test('should create valid field declaration', () => {
      expect(
        createFieldsArray('Foo', 'any', 'boolean')({ optional: true })
      ).toStrictEqual({
        '@@property_declaration': true,
        scheme: {
          arrayType: true,
          from: {
            name: 'Foo',
            serializer: null,
            type: 'any'
          },
          optional: true,
          schemeType: '@STRINGS',
          to: {
            name: '@@EMPTY_NAME',
            serializer: null,
            type: 'boolean'
          }
        }
      })
    })
  })
})
