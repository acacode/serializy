<div align="center">

  [![serializy](./assets/logo.png)](https://www.npmjs.com/package/serializy) 

  [![license](https://img.shields.io/badge/license-MIT-red.svg)](./LICENSE)
  [![npm](https://img.shields.io/npm/v/serializy.svg)](https://www.npmjs.com/package/serializy)
  [![](https://data.jsdelivr.com/v1/package/npm/serializy/badge)](https://www.jsdelivr.com/package/npm/serializy)
  [![build status](https://img.shields.io/travis/acacode/serializy.svg)](https://travis-ci.org/acacode/serializy)
  [![downloads per month](https://img.shields.io/npm/dm/serializy.svg)](http://npm-stat.com/charts.html?package=serializy)
  [![min size](https://badgen.net/bundlephobia/min/serializy)](https://bundlephobia.com/result?p=serializy)
  [![minzip size](https://badgen.net/bundlephobia/minzip/serializy)](https://bundlephobia.com/result?p=serializy)
  [![install size](https://packagephobia.now.sh/badge?p=serializy)](https://packagephobia.now.sh/result?p=serializy)

  <p>
    Object schema validation and data serialization
  </p>
</div>

## ❓ What is that ?

This thing allows you to don't have to worry about changing server-side structures!  
  
Sometimes when server change JSON structures or frontend start using different API  
These situations can make some problems in frontend applications  
Because mostly use the same structure from server when develop user interfaces  
  
But with **serializy** you can describe structure which you will use and which server wants to see  

Sounds interesting, yeah ? :-)  
Scroll down and take a look at the examples ;-)


## 💡 How to use

Nothing to hard, just create a class or simple object which will contain all your structure declarations (using `field()`, `fieldArray()`).  
And send this class/object to the `model()` function as argument  
Like in example:  

```js
import { field, fieldArray, model } from 'serializy'

class DeveloperDeclaration {
  likeCoffee = field('LIKE_COFFEE', 'boolean')
  languages = fieldArray('LaNgUagEs', 'string')
}
```
Creating declaration using class is not necessarily, you can create just a simple object:  
```js

const DeveloperDeclaration = {
  likeCoffee: field('LIKE_COFFEE', 'boolean'),
  languages: fieldArray('LaNgUagEs', 'string'),
}

```
  
```js
const DeveloperModel = model(DeveloperDeclaration)
```

And when you get server structure just create instance of your declared model:  

```js

const ServerStructure = {
  LIKE_COFFEE: true,
  LaNgUagEs: ['GoLang', 'Python']
}

const developer = new DeveloperModel(ServerStructure)
/*
  developer object will be
  {
    likeCoffee: true,
    languages: ['GoLang', 'Python']
  }
*/

```

But what if you need to change your client model and send it to the server ?  
You can use `.deserialize()` of the each created instance of declared model:  

```js

developer.likeCoffee = false
developer.languages.push('JavaScript')

developer.deserialize()
/*
{
  LIKE_COFFEE: false,
  LaNgUagEs: ['GoLang', 'Python', 'JavaScript']
}
*/
```
Also your created structure declaration (like `DeveloperModel`) have methods:  
- **`.serialize(serverModel)`** - to convert server-side structure to client-side  
- **`.deserialize(clientModel)`** - to convert client-side structure to server-side  
In addition, structure declarations have methods:  
- **`.getUsagePropertyNames()`** - returns array of usage property names declared in model  
- **`.getOriginalPropertyNames()`** - returns array of original property names declared in model  
- **`.getPropertiesMap(reverseNames?: boolean)`** - returns map where key is usage property name and value is original property name. `reverseNames` - just changing sides key/value  

## 📚 Documentation  

Serializy have exports: `field()`, `fieldArray()`, `model()`  

<hr>

### 🔹 **`field(...options: FieldOptions)`**[[Source]](./src/field_declaration.ts#L102)  

This function needed for transforming property of the original structure to usage property.  
Syntax: `field(...options: FieldOptions)` or `field(...options: FieldOptions)(propertyOptions: Partial<CommonPropertyOptions>)`  

Property options it is configuration object which can allows to change various behaviour of this property. Currently object have:  
```js
{
  optional: boolean
  // true - will say to serializy that this property
  // can be not contains in original/usage structure
  // By default: false
}
```

For example, you've got object `{ FirsT_naMe: 'John' }` and you need to convert property `"FirsT_naMe"` to the `"firstName"`, you can just write:  
```js
  const Struct = model({ // it is required wrapper for structure declarations
    firstName: field('FirsT_naMe', 'string')
    // firstName - name of the usage property
    // 'FirsT_naMe' (first arg) - name of the original property
    // 'string' (second arg) - type of the both sides properties
  })
```
Or you've got object with string value of number like `{ Age: '19' }` but you need to use type number, you can just write:  
```js
  const Struct = model({ // it is required wrapper for structure declarations
    age: field('Age', 'string', 'number')
    // firstName - name of the usage property
    // 'FirsT_naMe' (first arg) - name of the original property
    // 'string' (second arg) - type of original property
    // 'number' (third arg) - type of usage property
  })
```

Options:  

- **`field(originalPropertyName: string, originalType?: string, usageType?: string)`**
  
  This type of the field declaration allows you to describe simple properties which are mostly primitive values.  
  Arguments:  
      - **`originalPropertyName: string`** - name of the property in original structure.  Original property with this name will be assigned to usage property.  
      - **`originalType?: string`** - type of the original property.    
      - **`usageType?: string`** - needed type of the usage property.  

    note: `originalType` and `usageType` should be one of the [following strings](./src/converter.ts#L30) (`'boolean'`, `'number'`, `'string'`, `'object'`, `'any'`)  

  Examples:  
  ```js

  const Model = model({
    someProp: field('SomeProp','number','string')
    hidden: field('Hidden','boolean')({ optional: true })
    any: field('Any', 'any')
  })

  const structure = new Model({
    SomeProp: 12345,
    Any: { foo: 'bar' }
  })

  console.log(structure.someProp) // '12345'
  console.log(structure.deserialize()) // { SomeProp: 12345, Any: { foo: 'bar' } }
  ```  
![image](./assets/empty_block.png)  



  
  
  
- **`field(originalPropertyName: string, modelDeclaration: ModelDeclaration)`**  

  This type of the field declaration allows you to describe complex structures to usage structures    
  Arguments:  
      - **`originalPropertyName: string`** - name of the property in original structure.  Original property with this name will be assigned to usage property.  
      - **`modelDeclaration: ModelDeclaration`** - model declaration needed for convert original object into usage object.  
          [`modelDeclaration`](./src/field_declaration.ts#L8) should be `object`/`model(DeclarationsClass)`  
          And keys/properties should have values created via `field()`, `fieldArray()` function  


  Examples:  
  ```js
  const FooModel = model(class FooModel {
    foo = field('Foo', 'number', 'string')
  })

  class Model = model({class Model {
    fooStruct = field('FooStruct', FooModel)
  }})
  ```  
  ```js
  class Model = model({class Model {
    // or you can not create additional wrapped model() class
    fooStruct = field('FooStruct', {
      foo = field('Foo', 'number', 'string')
    })
  }})

  const fooBarStruct = new Model({
    FooStruct: { Foo: 12345 }
  })

  console.log(fooBarStruct) // { fooStruct: { foo: '12345' } }
  console.log(fooBarStruct.deserialize()) // { FooStruct: { Foo: 12345 } }
  ```  
![image](./assets/empty_block.png)  


  
  

  
- **`field(customSerializer: function, customDeserializer?: function)`**  

  You can attach custom serializer/deserializer for specific cases.  
  Arguments:  
      - **`customSerializer: function`** - this function should return value of the usage property. Takes one argument - original structure   
      - **`customDeserializer?: function`** - this function should return object which will been merged to the original structure. Takes one argument - usage structure  


  Examples:  
  ```js
  const Model = model({
    barBaz: field(
      ({ bar, baz }) => `${bar}/${baz}`,
      ({ barBaz }) => {
        const [bar, baz] = barBaz.split('/')
        return { bar, baz }
      }
    ),
    foo: field(({ foo }) => foo, ({ foo }) => ({ foo })) // in this case just better to use field('foo')
  })

  const structure = new Model({
    foo: 'foo',
    bar: 'bar',
    baz: 'baz'
  })

  console.log(structure) // { barBaz: 'bar/baz', foo: 'foo' }
  console.log(structure.deserialize()) // { foo: 'foo', bar: 'bar', baz: 'baz' }
  ```  
![image](./assets/empty_block.png)  


  
  

  
- **`field({ name: 'property_name', type: 'original_type', usageType: 'usage_type' }: object)`**  

  This is just another way to describe property.   
  Properties:  
      - **`name: string`** - key name in the original structure  
      - **`type?: PropertyType`** - type of the original property  
      - **`usageType?: PropertyType`** - type for usage property  
      - **`arrayType?: boolean`** - property have array type or not  
      - **`optional?: boolean`** - this property is required or not  


  Examples:  
  ```js
  const Model = model({
    someProp: field({
      name: 'SomeProp',
      optional: true,
      type: 'number',
      usageType: 'string'
    })
  })

  const structure = new Model({
    SomeProp: 12345
  })

  console.log(structure.someProp) // '12345' because usageType - 'string'
  console.log(structure.deserialize()) // { SomeProp: 12345 }
  ```  
![image](./assets/empty_block.png)  





<!-- Function `field()` needs you to describe some property of your model like  
```
class  -->

<hr>


### 🔹 **`fieldArray()`**[[Source]](./src/field_declaration.ts#L105)  

This is the same thing like [`field()`](#fieldsource) but it needs to describe array of data  

```js
  const Struct = model({ // it is required wrapper for structure declarations
    stringsArray: fieldArray('DataArray', 'string')
    // stringsArray - name of the usage property
    // 'DataArray' (first arg) - name of the original property which should be array
    // 'string' (second arg) - type of the each element in array
  })
```

Argument variations:  

- **`fieldArray(originalPropertyName: string, originalType?: string, usageType?: string)`**  
      - **`originalPropertyName`** - name of property which should be exist in original structure  
      - **`originalType?: string`** - type of the original property.  
      - **`usageType?: string`** - needed type of the usage property.  


- **`fieldArray(originalPropertyName: string, modelDeclaration: ModelDeclaration)`**  
      - **`originalPropertyName`** - name of property which should be exist in original structure  
      [`modelDeclaration`](./src/field_declaration.ts#L8) should be `object`/`model(DeclarationsClass)`  
      And keys/properties should have values created via `field()`, `fieldArray()` function  

<hr>


### 🔹 `model()`[[Source]](./src/model_wrapper.ts#L48)  

This function allows to make model from structure declaration.  
Syntax: 
```js
  model(YourStructDeclaration: object | class, config?: object)

  // YourStructDeclaration can be:

  YourStructDeclaration = {
    foo: field('foo')
  }
  class YourStructDeclaration {
    foo = field('foo')
  }

  // config contains properties:
  const config = {
    warnings: boolean // - disable/enable most warnings based on this declaration
  }

```


Examples:  
```js
  const Struct = model({ // it is required wrapper for structure declarations
    // your property declarations
    firstName: field('FirstName')
    lastName: field('LastName')
  })
```

   
   
   
## 📄 Examples  

All examples are located [here](./example/index.ts)  

![example of usage 1](./assets/serializy_example.png)
![example of usage 2](./assets/serializy_example2.png)


## 📢 Integrations  

  [**kinka-serializy**](https://github.com/acacode/kinka-serializy) - integration serializy with http web-client [**kinka**](https://github.com/acacode/kinka)  
  [**axios-serializy**](https://github.com/acacode/axios-serializy) - integration serializy with http web-client [**axios**](https://github.com/axios/axios)


## 📝 License

Licensed under the [MIT License](./LICENSE).
