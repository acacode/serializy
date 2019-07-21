# CHANGELOG

<!-- TEMPLATE OF NEW VERSION -->

<!-- 
## [VERSION](https://github.com/acacode/serializy/releases/tag/VERSION)

### Changed
### Fixed
### Added
### Removed
 -->

## [1.0.0-alpha.2](https://github.com/acacode/serializy/releases/tag/1.0.0-alpha.2)

### Fixed
- Problem with `.deserialize()` function

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