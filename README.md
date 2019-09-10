# Hummingbird

[![GitHub issues](https://img.shields.io/github/issues/kennyarehart/hummingbird.svg?style=flat-square)](https://github.com/kennyarehart/hummingbird)
[![GitHub contributors](https://img.shields.io/github/contributors/kennyarehart/hummingbird.svg?style=flat-square)](https://github.com/kennyarehart/hummingbird/graphs/contributors/)
[![GitHub commit-activity](https://img.shields.io/github/commit-activity/y/kennyarehart/hummingbird.svg?style=flat-square)](https://github.com/kennyarehart/hummingbird/commits/master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

---

Hummingbird is a library for working with Javascript's <code>requestanimationframe</code> to centralize a universal ticker for animations, timers, intervals, etc.

### Problem

-   Mixing multiple <code>requestanimationframe</code>, <code>setTimeout</code>, <code>setInterval</code> calls can degrade performance.
-   Pausing, resuming, and controlling the iteration speed are not possible without extensive extra code.

### Solution

Hummingbird solves all of these and more! By leveraging a single iterator along with intelligently grouping logic, the number of calls are optimized to give the best possible browser performance, even at high volumes of handlers.

### Features

-   Speed control on a per method basis
-   Pause / Resume on the instance or globally
-   Add <code>lifeSpan</code> to work as a timeout for the instance

```js
import { Hummingbird } from 'hummingbird'

// SETUP - have various methods to call on iteration
function myFirstMethod() {
	...
}

const myOtherMethod = () => {
	...
}

// most basic usage, simply create a Hummingbird instance passing in the method to be called
new Hummingbird(myFirstMethod)
// OR omit the 'new' keyword
Hummingbird(myFirstMethod)
// AND assign it to a variable for specific targeting
const myBird = Hummingbird(myFirstMethod)

// create an instance and add optional properties
Hummingbird(myOtherMethod, {
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
		// a = true, b = 'foo'
	},
	// provide params to the handler
	onCompleteParams: [true, 'foo']
})

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
