# CHANGELOG

<!-- TEMPLATE OF NEW VERSION -->

<!-- 
## [VERSION](https://github.com/acacode/serializy/releases/tag/VERSION)

### Changed
### Fixed
### Added
### Removed
 -->

## [1.0.0-beta.1](https://github.com/acacode/serializy/releases/tag/1.0.0-beta.1)

### Fixed  
- Problems with deserializing `undefined` value  
- Wrongs warning/error messages linked with serializing empty objects and `null` values  
- Warnings in console when some property is `null` or `undefined`  
- [Critical bug] Deserializing structures using `Model.deserialize()` was not working with objects not created via `serializy`  

### Changed    
- Warning, error, exception messages (typo, more friendly messages)  
- [Internal] Changed return value of `field()/fieldsArray()`  

### Added  
- `optional` field configuration property  
- New type of field declaration  
    `field({ name: 'prop_name', type: 'prop_type', usageType: 'usage_prop_type' })`  
- [Internal] Unit tests  
- Added abilities for `fieldsArray()` function. Now available common schemes:  
    - `fieldsArray('prop_name', 'prop_type', 'usage_prop_type')`  
    - `fieldsArray('prop_name', ModelDeclaration)`  

### Removed  
- [Internal] Scheme types : `ONE_STRING`, `TWO_STRINGS`, `THREE_STRINGS` (Combine this types into one `STRINGS`)  





## [1.0.0-alpha.2](https://github.com/acacode/serializy/releases/tag/1.0.0-alpha.2)

### Fixed
- Problem with `.deserialize()` function

### Changed  
- Fully removed `yarn` from project because already using npm






## [1.0.0-alpha.1](https://github.com/acacode/serializy/releases/tag/1.0.0-alpha.1)

### Internal
- Fixed internal typings  
- Added `isPrimitive()` helper  
- Renamed `ConvertationConfig` to `ConvertConfig` (TypeScript interface)

### Fixed  
- Warnings in console if field is `null`

### Removed  
- Casting to types: `'float'`, `'integer'`. Instead of these use `'number'`  

### Changed  
- Renamed `'UnknownModel'` to `'Model'` if you use `field(simpleObjectStructure)`
- Update warning/exception messages (fix typo and added emojis)

### Added  
- Optional custom deserializer in `field(customSerializer, customDeserializer)` scheme  
    Now is possible to use just `field(customSerializer)` if you don't needed to have this field in deserialized structure  
- Unit tests for:  
    - build files  
    - constants module  
    - scheme module  






## [0.0.1-beta](https://github.com/acacode/serializy/releases/tag/0.0.1-beta)

### Added
- Added new types for type declaration: `'any'`, `'object'`






## [0.0.1-alpha](https://github.com/acacode/serializy/releases/tag/0.0.1-alpha)

### Added
- Created a library (rollup build, small documentation)  
- Added functions: `field()`, `fieldArray()`, `model()`  