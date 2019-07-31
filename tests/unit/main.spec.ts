import { field, model } from '../../src'
import { clearConsole, consoleMessages, mockConsole } from './__helpers__'

describe('main unit tests (real test cases)', () => {
  mockConsole(false)
  clearConsole()

  describe('nullable/undefined fields', () => {
    describe('shouldn\t create any no warnings because of field is null', () => {
      clearConsole()

      test('warnings in console should be zero', () => {
        const NullableModel = model(
          class NullableModel {
            foo = field('Field', 'string')
          }
        )

        new NullableModel({ Field: null }).deserialize()

        expect(consoleMessages.warn.length).toBe(0)
      })
    })

    describe('should create warnings because field is not exist in original structure', () => {
      clearConsole()

      test('warnings in console should be 4', () => {
        const TestModel = model(
          class TestModel {
            foo = field('Field', 'string')
          }
        )

        new TestModel({}).deserialize()

        expect(consoleMessages.warn.length).toBe(4)
      })
    })

    describe('shouldn\t create any warnings because of field is not exist in original structure and enabled property - optional', () => {
      clearConsole()

      test('warnings in console should be 0', () => {
        const TestModel = model(
          class TestModel {
            foo = field('Field', 'string')({ optional: true })
          }
        )

        new TestModel({}).deserialize()

        expect(consoleMessages.warn.length).toBe(0)
      })
    })
  })

  describe('serialize/deserialize', () => {
    clearConsole()

    test('warnings in console should be 0', () => {
      const SubModel = model(
        class TestModel {
          foo = field('Foo', 'string')
        }
      )

      const TestModel = model(
        class TestModel {
          foo = field('Foo', 'string')
          subModel = field('SubModel', SubModel)
        }
      )

      TestModel.serialize({ Foo: 'bar', SubModel: { Foo: 'bar' } })

      TestModel.deserialize({ foo: 'bar', subModel: { foo: 'bar' } })

      expect(consoleMessages.warn.length).toBe(0)
    })

    describe('deserialize() should return the same value as before serialize()', () => {
      const testCases = [
        () => {
          const SubModel = model(
            class TestModel {
              foo = field('Foo', 'string')
            }
          )

          const TestModel = model(
            class TestModel {
              foo = field('Foo', 'string')
              subModel = field('SubModel', SubModel)
            }
          )

          const originalData = { Foo: 'bar', SubModel: { Foo: 'bar' } }
          return { originalData, TestModel, description: 'test case 1' }
        },
        () => {
          const TestModel = model(
            class TestModel {
              foo = field('Foo', 'string')
              subModel = field('SubModel', 'any')
            }
          )

          const originalData = {}
          return { originalData, TestModel, description: 'test case 2' }
        },
        () => {
          const TestModel = model(
            class TestModel {
              foo = field('Foo', 'string')
              subModel = field('SubModel', 'any')
            }
          )

          const originalData = { Foo: null }
          return { originalData, TestModel, description: 'test case 3' }
        }
      ]

      testCases.forEach((testCase: any) => {
        const { originalData, TestModel, description } = testCase()
        test(description, () => {
          const serializedStructure = TestModel.serialize(originalData)

          expect(TestModel.deserialize(serializedStructure)).toStrictEqual(
            originalData
          )
        })
      })
    })
  })
})
