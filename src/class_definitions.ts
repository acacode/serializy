import {
    createSchemeFromOptions,
    FromAnyDeclaration,
    FromArrayDeclaration,
    PropDeclaration,
    PropDeclarationConfiguration,
    ValueOf
} from '.'

const createPropDeclaration = <M extends object = any>(
    config: PropDeclarationConfiguration<M>
  ): PropDeclaration => {

  const propDeclaration: PropDeclaration = {
    '@@array_property_declaration': !!config['@@array_property_declaration'],
    '@@property_declaration': true,
  }

  const scheme = createSchemeFromOptions(config.options, propDeclaration)

  console.log('scheme', scheme)

  return propDeclaration
}

export const makeModel = <T = any>(declaration: T): ValueOf<T> => {
    // @ts-ignore
  const DeclaredModel = new (declaration as (new () => ValueOf<T>))()
  console.log('declaration', declaration)
  return DeclaredModel
}

export const from = <M extends object = any>(...args: FromAnyDeclaration<M>) =>
    createPropDeclaration<M>({
      options: args,
    })

export const fromArray = (...args: FromArrayDeclaration) =>
    createPropDeclaration({
      '@@array_property_declaration': true,
      options: args,
    })
