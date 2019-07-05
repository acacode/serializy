import * as serializyFromLib from '../../lib/serializy'
import * as serializyMinFromLib from '../../lib/serializy.min'
import * as serializySrc from '../../src'

import { simpleObjectCopy, testAllCases } from './__helpers__'
import { createModelUsingSpec } from './__spec__'

const createBuildFilesTest = (serializyBuild: any, filePath: string) => {
  describe(`Test build files (${filePath})`, () => {
    const funcs: any = {
      field: [['should be defined', () => expect(serializyBuild.field).toBeDefined()]],
      fieldArray: [['should be defined', () => expect(serializyBuild.fieldArray).toBeDefined()]],
      model: [['should be defined', () => expect(serializyBuild.model).toBeDefined()]]
    }
    testAllCases(funcs, func => `${func}()`)

    describe('model.serialize()', () => {
      test('Should be possible to serialize structure', () => {
        const { serializedModel, usageStructure } = createModelUsingSpec(serializyBuild)
        // using object copy is required because 'serializedModel' is not just simple object (have instances of models)
        expect(simpleObjectCopy(serializedModel)).toStrictEqual(simpleObjectCopy(usageStructure))
      })
    })

    describe('model.deserialize()', () => {
      test('Should be possible to deserialize structure', () => {
        const { serializedModel, originalStructure } = createModelUsingSpec(serializyBuild)
        expect(serializedModel.deserialize()).toStrictEqual(originalStructure)
      })
    })
  })
}

createBuildFilesTest(serializySrc, 'src/index.js')
createBuildFilesTest(serializyMinFromLib, 'lib/serializy.min.js')
createBuildFilesTest(serializyFromLib, 'lib/serializy.js')
// tslint:disable-next-line:no-var-requires
createBuildFilesTest(require('../../dist/serializy.min.js'), 'dist/serializy.min.js')
// tslint:disable-next-line:no-var-requires
createBuildFilesTest(require('../../dist/serializy.js'), 'dist/serializy.js')
