# Hummingbird

[![GitHub issues](https://img.shields.io/github/issues/kennyarehart/hummingbird.svg?style=flat-square)](https://github.com/kennyarehart/hummingbird)
[![npm downloads](https://img.shields.io/npm/dm/@ff0000-ad-tech%2Fad-velvet.svg?style=flat-square)](https://www.npmjs.com/package/@ff0000-ad-tech%2Fad-velvet)
[![GitHub contributors](https://img.shields.io/github/contributors/kennyarehart/hummingbird.svg?style=flat-square)](https://github.com/kennyarehart/hummingbird/graphs/contributors/)
[![GitHub commit-activity](https://img.shields.io/github/commit-activity/y/kennyarehart/hummingbird.svg?style=flat-square)](https://github.com/kennyarehart/hummingbird/commits/master)
[![npm license](https://img.shields.io/npm/l/@ff0000-ad-tech%2Fad-velvet.svg?style=flat-square)](https://github.com/kennyarehart/hummingbird/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

---

Hummingbird is a universal ticker for animations, timers, intervals, etc. Mixing multiple <code>requestanimationframe</code>, <code>setTimeout</code>, <code>setInterval</code> calls can degrade performance. Additionally, pausing, resuming, and controlling the iteration speed are not possible with extensive extra code. Hummingbird solves all of these and more! By leveraging a single iterator along with intelligently grouping logic, the number of calls are optimized to give the best possible browser performance, even at high volumes of handlers.

```js
import { Hummingbird } from 'hummingbird'

// SETUP - have various methods to call on iteration
function myMethod1() {
	console.log('myMethod1')
}

const myMethod2 = () => {
	console.log('myMethod1')
}

function myMethod3() {
	console.log('myMethod3')
}

// most basic usage, simply create a Hummingbird instance passing in the method to be called
new Hummingbird(myMethod1)
// OR omit the 'new' keyword
Hummingbird(myMethod1)

// create an instance and add optional properties
Hummingbird(myMethod2, {
	// flaps per second / iteration / speed
	speed: 18,
	// how to interpret speed value: SECONDS or FLAPS. default: FLAPS
	speedIn: FLAPS,
	// how long the method will called for
	lifeSpan: 3,
	// how to interpret speed lifeSpan: SECONDS or FLAPS. default: SECONDS
	lifeSpanIn: SECONDS,
	// if lifeSpan, add a handler
	onComplete: function(a, b) {
		console.log(a, b) // true, 'foo'
	},
	// provide params to the handler
	onCompleteParams: [true, 'foo']
})

// creation returns an instance if specific targeting needed
const myBird = Hummingbird(myMethod3)

// Hummingbird has global methods to control all instances
// Pause the whole engine so no methods are called
Hummingbird.sleep()

// Then start it back up
Hummingbird.wake()

// or remove a method later
Hummingbird.release(myMethod2)

// each global method is also available on the instance.
myBird.wake()
```
