# CHANGELOG

<!-- TEMPLATE OF NEW VERSION -->

<!-- 
## [VERSION](https://github.com/acacode/serializy/releases/tag/VERSION)

### Changed
### Fixed
### Added
### Removed
 -->

## [1.0.0-alpha.1](https://github.com/acacode/serializy/releases/tag/1.0.0-alpha.1)

### Fixed  
- Warnings in console if field is `null`

### Removed  
- Casting to types: `'float'`, `'integer'`. Instead of these use `'number'`  

### Added
- Non required custom deserializer in `field(customSerializer, customDeserializer)` scheme  
    Now is possible to use just `field(customSerializer)` if you don't needed to have this field in deserialized structure


## [0.0.1-beta](https://github.com/acacode/serializy/releases/tag/0.0.1-beta)

### Added
- Added new types for type declaration: `'any'`, `'object'`


## [0.0.1-alpha](https://github.com/acacode/serializy/releases/tag/0.0.1-alpha)

### Added
- Created a library (rollup build, small documentation)  
- Added functions: `field()`, `fieldArray()`, `model()`  