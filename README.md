<div align="center">

  [![serializy](./assets/logo.png)](https://www.npmjs.com/package/serializy) 

  [![](https://img.shields.io/badge/license-MIT-red.svg)](./LICENSE)
  [![](https://img.shields.io/npm/v/serializy.svg)](https://www.npmjs.com/package/serializy)
  [![](https://img.shields.io/travis/acacode/serializy.svg)](https://travis-ci.org/acacode/serializy)
  [![](https://img.shields.io/npm/dm/serializy.svg)](http://npm-stat.com/charts.html?package=serializy)
  [![](https://badgen.net/bundlephobia/min/serializy)](https://bundlephobia.com/result?p=serializy)
  [![](https://badgen.net/bundlephobia/minzip/serializy)](https://bundlephobia.com/result?p=serializy)

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
Creating declaration using class is not important, you can create just a simple object:  
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

console.log(developer.likeCoffee) // will be true :-)
```

But what if you need to change your client model and send it to the server ?  
You can use `.deserialize()` of each created instance of declared model:  

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
- `.serialize(serverModel)` - to convert server-side structure to client-side  
- `.deserialize(clientModel)` - to convert client-side structure to server-side  
  
## 📚 Documentation
Serializy have exports: `field()`, `fieldArray()`, `model()`  

<hr>

### 🔹 `field()`[[Source]](./src/field_declaration.ts#L102)  

This function is needed for describing property of server-side structure.  
![image](https://user-images.githubusercontent.com/16340911/60381983-1539e180-9a65-11e9-874e-7c67d4244b2e.png)  

Argument variations:  
- ◼️ `field(originalPropertyName: string, originalType?: string, usageType?: string)`  

`originalType` and `usageType` should be one of the [following strings](./src/converter.ts#L30) ('boolean', 'number', 'string', 'object', 'any'):  


![image](https://user-images.githubusercontent.com/16340911/60689395-9d851000-9ec5-11e9-99bc-cb55b3ea6ea1.png)  





  
- ◼️ `field(originalPropertyName: string, modelDeclaration: ModelDeclaration)`  

  [Description]  
  Arguments:  
      - ◾️ `originalPropertyName: string` - name of the property in original structure.  Original property with this name will be assigned to usage property.  
      - ◾️ `modelDeclaration: ModelDeclaration` - model declaration needed for convert original object into usage object.  
          [`modelDeclaration`](./src/field_declaration.ts#L8) should be `object`/`model(DeclarationsClass)`  
          And keys/properties should have values created via `field()`, `fieldArray()` function  


![image](https://user-images.githubusercontent.com/16340911/60382161-f9840a80-9a67-11e9-9ea8-a5e56762b13a.png)  
![image](https://user-images.githubusercontent.com/16340911/60382173-1f111400-9a68-11e9-8fb1-f1a2e7c11a6d.png)  





  
- ◼️ `field(customSerializer: function, customDeserializer?: function)`  

  You can attach custom serializer/deserializer for specific cases.  
  Arguments:  
      - ◾️ `customSerializer: function` - this function should return value of the usage property. Takes one argument - original structure   
      - ◾️ `customDeserializer?: function` - this function should return object which will been merged to the original structure. Takes one argument - usage structure  


![image](https://user-images.githubusercontent.com/16340911/60382224-c4c48300-9a68-11e9-963c-606971be4564.png)  





  
- ◼️ `field({ name: 'property_name', type: 'original_type', usageType: 'usage_type' }: object)`  

  This is just another way to declare property.   
  Properties:  
      - ◾️ `name: string` - key name in the original structure  
      - ️◾️ `type?: PropertyType` - type of the original property  
      - ◾️ `usageType?: PropertyType`- type for usage property  
      - ◾️ `arrayType?: boolean` - property have array type or not  
      - ◾️ `optional?: boolean` - this property is required or not  


![image](https://user-images.githubusercontent.com/16340911/62254558-44e05e80-b402-11e9-8fd6-59e3491d0238.png)  





  
<!-- Function `field()` needs you to describe some property of your model like  
```
class  -->

<hr>


### 🔹 `fieldArray()`[[Source]](./src/field_declaration.ts#L105)  

This is the same thing like [`field()`](#fieldsource) but it needs to describe array of data  
![image](https://user-images.githubusercontent.com/16340911/60383955-019c7400-9a81-11e9-8c49-270617f0f8be.png)

Argument variations:  

- ◼️ `fieldArray(originalPropertyName: string, originalType?: string, usageType?: string)`  
`originalPropertyName` - name of property which should be exist in original structure  
`originalType` should be one of the [following strings](./src/converter.ts#L30) ('boolean', 'number', 'string', 'object', 'any')  


- ◼️ `fieldArray(originalPropertyName: string, modelDeclaration: ModelDeclaration)`  
`originalPropertyName` - name of property which should be exist in original structure  
[`modelDeclaration`](./src/field_declaration.ts#L8) should be `object`/`model(DeclarationsClass)`  
And keys/properties should have values created via `field()`, `fieldArray()` function  

<hr>


### 🔹 `model()`[[Source]](./src/model_wrapper.ts#L48)  

This function allows to make model from structure declaration.  

![image](https://user-images.githubusercontent.com/16340911/60385059-d5d3bb00-9a8d-11e9-89f5-258d2364ab52.png)  


   
   
   
## 📄 Examples  

All examples are located [here](./example/index.ts)  

![example of usage 1](./assets/serializy_example.png)
![example of usage 2](./assets/serializy_example2.png)


## 📢 Integrations  

  [kinka-serializy](https://github.com/acacode/kinka-serializy) - integration serializy with http web-client `kinka`  


## 📢 Plans 

Currently is needed to create integration with [`axios`](https://github.com/axios/axios)  
And that I think will been a great idea, because you will just needed to say http web-clients what you want to see in the response of http request  


## 📝 License

Licensed under the [MIT License](./LICENSE).
