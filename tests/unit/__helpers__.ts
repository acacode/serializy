export interface TestableData {
  [propertyName: string]: Array<[string, any]>
}

export const testAllCases = (
  testableData: TestableData,
  getDescribeName: (propertyName: string) => string
) => {
  Object.keys(testableData).forEach(propertyName => {
    describe(getDescribeName(propertyName), () => {
      const tests = testableData[propertyName]
      tests.forEach(([nameOfTest, testFunc]: [string, any]) => {
        test(nameOfTest, testFunc)
      })
    })
  })
}

export const testPropertiesOnExist = (
  requiredProperties: Array<[string, string]>,
  objectContainsProperties: any
) => {
  requiredProperties.forEach(([property, type]) => {
    describe(`"${property}" property`, () => {
      test(`module should contain this property`, () => {
        expect(objectContainsProperties).toHaveProperty(property)
      })
      test(`this property should have type "${type}"`, () => {
        expect(typeof objectContainsProperties[property]).toBe(type)
      })
    })
  })
}

export const simpleObjectCopy = (object: any) =>
  JSON.parse(JSON.stringify(object))

const mockedMethods = ['log', 'warn', 'error']
export const { originalConsoleFuncs, consoleMessages } = mockedMethods.reduce(
  (acc: any, method: any) => {
    acc.originalConsoleFuncs[method] = console[method].bind(console)
    acc.consoleMessages[method] = []

    return acc
  },
  {
    consoleMessages: {},
    originalConsoleFuncs: {}
  }
)

export const mockConsole = (callOriginals?: boolean) => {
  const createMockConsoleFunc = (method: any) => {
    console[method] = (...args: any[]) => {
      consoleMessages[method].push(args)
      if (callOriginals) return originalConsoleFuncs[method](...args)
    }
  }

  const deleteMockConsoleFunc = (method: any) => {
    console[method] = originalConsoleFuncs[method]
    consoleMessages[method] = []
  }

  beforeEach(() => {
    mockedMethods.forEach((method: any) => {
      createMockConsoleFunc(method)
    })
  })

  afterEach(() => {
    mockedMethods.forEach((method: any) => {
      deleteMockConsoleFunc(method)
    })
  })
}
