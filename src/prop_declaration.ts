import { DECLARATION_ARRAY_PROP, DECLARATION_PROP } from './constants'
import { FieldArrayDeclaration, FieldDeclaration } from './field_declaration'
import { createSchemeFromOptions, Scheme } from './scheme'

export declare interface PropDeclaration {
  [DECLARATION_ARRAY_PROP]: boolean
  [DECLARATION_PROP]: true,

  scheme: Scheme
}

export declare interface PropDeclarationConfig<M = any> {
  [DECLARATION_ARRAY_PROP]?: boolean
  options: FieldDeclaration<M> | FieldArrayDeclaration
}

export const createPropDeclaration = <M = any>(config: PropDeclarationConfig<M>): PropDeclaration => {
  return {
    [DECLARATION_ARRAY_PROP]: !!config[DECLARATION_ARRAY_PROP],
    [DECLARATION_PROP]: true,
    scheme: createSchemeFromOptions(config)
  } as PropDeclaration
}
