[Hummingbird]() is a library that makes it easier to work with tickers and timers in Javascript; Fully scalable to include any number of methods at various iteration speeds and life spans. Using instance or global methods, you can sleep, resume and release methods from being handled.

See the API docs for a more indepth as they are more comprehensive.

## Creating a Hummingbird

There are a few ways to create a [Hummingbird]() instance, including optional parameters. The simplest usage is to create an instance with an inline anonymous function. This will be called 30 times a second.

```
new Hummingbird(function() {
    ...
})
```

or pass in a function to an instance:

```
function foo() {
    ...
}
new Hummingbird(foo)
```

### Create without new

The <code>new</code> keyword is optional with [Hummingbird]()

```
Hummingbird(foo)
```

### Store a reference

Creating a [Hummingbird]() returns an instance which can be stored in a variable. This is to access direct methods on the instance or to be passed in to global methods for control.

```
const fooBird = Hummingbird(foo)
```

### Optional parameters

There are a number of optional parameters to control the speed, how that speed is interpreted, add a limit to the length of time the handler is called, how that time value is interpreted along with a handler for when that life span.

```
const fooBird = Hummingbird(foo, {
    speedIn: SECONDS,   // interpret speed in seconds
    speed: 1.3,         // will call handler once every 1.3 seconds
    lifeSpanIn: FLAPS,  // interpret lifeSpan in flaps
    lifeSpan: 3,        // will call handler only 3 times
    onComplete: function(a, b) {    // if lifeSpan, add a handler
        // a = true, b = 'ruh'
    },
    onCompleteParams: [true, 'ruh'] // provide params to the handler
})
```

### Controling the instance

There are methods on the Hummingbird instance to sleep (pause), wake (resume), and release (remove) it. Note that if all instances are asleep, the entire engine will stop running. Likewise, if any instance is unpaused, the engine will resume running.

```
fooBird.sleep()
// or
fooBird.wake()
```

## Expanding to multiple methods

The real strength of Hummingbird comes when multiple methods all need to be called at the same time.

```
// various types of methods
function foo() { ... }
const bar = () => { ... }
const quz = {
    baz: () => { ... }
}

Hummingbird(foo)
Hummingbird(bar)
Hummingbird(quz.baz)
```

This allows for controls to be called on the global static reference to Hummingbird.

```
Hummingbird.sleep()
// or
Hummingbird.wake()
```

### Mixing speeds

Each instance can have a unique speed allowing for complex combinations of speeds.

```
Hummingbird(foo, { speed: 12 })
Hummingbird(bar, { speed: 24 })
Hummingbird(quz.baz) // uses the default 30 fps
```
