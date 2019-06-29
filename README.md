<div align="center">

  [![serializy](./assets/logo.png)](https://www.npmjs.com/package/serializy) 

  [![](https://img.shields.io/badge/license-MIT-red.svg)](./LICENSE)
  [![](https://img.shields.io/npm/v/serializy.svg)](https://www.npmjs.com/package/serializy)
  [![](https://img.shields.io/travis/acacode/serializy.svg)](https://travis-ci.org/acacode/serializy)
  [![](https://img.shields.io/npm/dm/serializy.svg)](http://npm-stat.com/charts.html?package=serializy)
  [![](https://badgen.net/bundlephobia/min/serializy)](https://bundlephobia.com/result?p=serializy)
  [![](https://badgen.net/bundlephobia/minzip/serializy)](https://bundlephobia.com/result?p=serializy)

  <p>
    Data mapper between client-side and server-side applications
  </p>
</div>

## ❓ What is that ?

This thing allows you to don't have to worry about changing server-side models!  
  
Sometimes when server change API models or frontend start using different API  
These situations can make some problems in frontend applications  
Because mostly use the same model from server when develop the user interfaces  
  
But with **serializy** you can describe model which you will use and which server wants to see  

Sounds interesting, yeah ? :-)  
Scroll down and take a look at the examples ;-)


## Examples  

![example of usage 1](./assets/serializy_example.png)
![example of usage 2](./assets/serializy_example2.png)

## 💡 How to use

Nothing to hard, just create class or simple object which will contain all your model declarations (using `field()`, `fieldArray()`).  
And send this class/object to the `model()` function as argument  
Like in example:  

```js
import { field, model } from 'serializy'

class CoffeeDeclaration {
  isDrink = field('IS_THAT_DRINK', 'boolean')
}

const YourCoffeModel = model(CoffeeDeclaration)
```

And when you get server model just create instance of your declared model:  

```js

const ServerModel = {
  IS_THAT_DRINK: true
}

const coffee = new YourCoffeModel(ServerModel)

console.log(coffee.isDrink) // yeah, it will be true :-)
```

## 📚 Documentation
Serializy have exports: `field()`, `fieldArray()`, `model()`  

... Documentation in progress ... :-(

<!-- Function `field()` needs you to describe some property of your model like  
```
class  -->


## 📝 License

Licensed under the [MIT License](./LICENSE).
