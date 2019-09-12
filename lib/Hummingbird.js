import { enlist, release, releaseSingle, sleep, wake, createTimer, addTimer } from './manager'
import { calculateFPS, isNumber, toggleLife } from './utils'
import { SECONDS, FLAPS } from './constants'

/**
 * A Hummingbird is a single object that holds a single method to be called on a set
 * iteration speed.
 *
 * @class
 * @category API
 * @constructor
 *
 * @param {function} handler - The method called on each tick based on speed
 * @param {object} [args] - Optional parameters
 * @param {number} [args.speed=30] - The frequency that the {@link Hummingbird}'s handler will be called
 * @param {string} [args.speedIn={@link FLAPS}] - How to interpret the <code>speed</code>
 * @param {*} [args.scope] - What <code>this</code> will be on the handler
 * @param {number} [args.lifeSpan=undefined] - Length of time the handler will be active
 * @param {string} [args.lifeSpanIn={@link SECONDS}] - How to interpret <code>lifeSpan</code>
 * @param {function} [args.onComplete=undefined] - Called when <code>lifeSpan</code> value is reached
 * @param {array} [args.onCompleteParams] - Parameters passed through <code>onComplete</code>
 *
 * @example
 * import { Hummingbird } from 'hummingbird'
 *
 * function foo() { ... }
 * function bar() { ... }
 *
 * // basic creation, using default speed (30 fps)
 * const fooBird = new Hummingbird(foo)
 *
 * // complex creation, things to note:
 * // - 'new' is optional
 * // - use 'args' object to pass in optional parameters
 * // - does not require being assinged to variable
 * Hummingbird(bar, {
 * 	// interpret speed in seconds
 * 	speedIn: SECONDS,
 * 	// will call handler once every 1.3 seconds
 * 	speed: 1.3,
 * 	// interpret lifeSpan in flaps
 * 	lifeSpanIn: FLAPS,
 * 	// will call handler only 3 times
 * 	lifeSpan: 3,
 * 	// if lifeSpan, add a handler
 * 	onComplete: function(a, b) {
 * 		// a = true, b = 'ruh'
 * 	},
 * 	// provide params to the handler
 * 	onCompleteParams: [true, 'ruh']
 * })
 */
const Hummingbird = function(handler, args) {
	args = args || {}
	const T = this

	// allow for omitting 'new'
	if (!(T instanceof Hummingbird)) {
		return new Hummingbird(handler, args)
	}

	T._handler = handler

	// Optional args:
	T.speedIn = args.speedIn || FLAPS
	T._speed = calculateFPS(args.speed || 30, T.speedIn)
	T.scope = args.scope || null
	T.name = args.name || 'hb-' + Math.round(Date.now() * Math.random())

	if (args.lifeSpan) {
		T.lifeSpan = args.lifeSpan
		T.lifeSpanIn = args.lifeSpanIn || SECONDS
		T.onComplete = args.onComplete || function() {}
		T.onCompleteParams = args.onCompleteParams
		T.lifeTimer = createTimer(T)
	}

	T._parent = null
	T.isReleased = false

	// init
	enlist(T)
}

Hummingbird.prototype = {
	/**
	 * The iteration speed of the instance.
	 * @param {number} val
	 * @returns {Hummingbird} Itself for method chaining
	 * @example
	 * // continued from Constructor example
	 * // changes the speed from the default 30 fps to 24 fps
	 * foobird.speed(24)
	 */
	speed: function(val) {
		const T = this
		if (val & isNumber(val)) {
			releaseSingle(T)
			T._speed = calculateFPS(val, T.speedIn)
			enlist(T, true)
			return T
		} else {
			return T._speed
		}
	},

	/**
	 * Will sleep (pause) this Hummingbird instance so it will not be called on iterations. If this
	 * is the only and/or last active instance, the entire engine will stop running.
	 * @returns {Hummingbird} Itself for method chaining
	 * @see {@link sleep Hummingbird.sleep}
	 * @example
	 * // continued from Constructor example
	 * foobird.sleep()
	 */
	sleep: function() {
		sleep(this)
		return this
	},

	/**
	 * Will wake (resume) this Hummingbird instance so it will not be called on iterations.
	 * If this instance has been released, calling this will act as if creating a new instance
	 * without the memory bloat of actually creating. This includes reseting lifeSpan to run again.
	 * This will activate the entire engine if it is not already running.
	 * @returns {Hummingbird} Itself for method chaining
	 * @see {@link wake Hummingbird.wake}
	 * @example
	 * // continued from Constructor example
	 * foobird.wake()
	 */
	wake: function() {
		const T = this
		if (T.isReleased) {
			enlist(T)
			if (T.lifeTimer) addTimer(T.lifeTimer)
			T.isReleased = false
		} else {
			wake(T)
		}
		return T
	},

	/**
	 * Will release (remove) this Hummingbird instance from the engine. Note that this does NOT
	 * destroy itself and any external variables holding reference to the instance are still valid.
	 * Be mindful of assigning instances to variables repeatedly as it can cause a bloat without
	 * allowing for proper garbage collection.
	 * @returns {Hummingbird} Itself for method chaining
	 * @see {@link release Hummingbird.release}
	 * @example
	 * // continued from Constructor example
	 * foobird.release()
	 */
	release: function() {
		const T = this
		if (!T.isReleased) {
			releaseSingle(T)
			T.isReleased = true
		}
		return T
	},

	/**
	 * The string representation of the Hummingbird
	 * @returns {String}
	 */
	toString: () => 'Hummingbird',

	// internally called methods
	squawk: function() {
		const T = this
		T._handler.call(T.scope, T)
		return T
	},
	sleepLife: function() {
		toggleLife(this, true)
	},
	wakeLife: function() {
		toggleLife(this, false)
	}
}

Hummingbird.release = release
Hummingbird.sleep = sleep
Hummingbird.wake = wake
//Hummingbird.defaultFps

export default Hummingbird
