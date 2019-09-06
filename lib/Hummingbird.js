import { enlist, release, releaseSingle, sleep, wake, createTimer, addTimer } from './manager'
import { calculateFPS, isNumber } from './utils'
import { SECONDS, FLAPS } from './constants'

/**
 * @class Hummingbird
 * @param {Function} handler
 * @param {Object} args
 * @desc
 *
 * @example
 * import { Hummingbird } from 'hummingbird'
 *
 * // SETUP - have various methods to call on iteration
 * function myMethod1 () {
 * 	console.log('myMethod1')
 * }
 *
 * const myMethod2 = () => {
 * 	console.log('myMethod1')
 * }
 *
 * function myMethod3() {
 * 	console.log('myMethod3')
 * }
 *
 * // most basic usage, simply create a Hummingbird instance that
 * new Hummingbird(myMethod1)
 * // OR omit the 'new' keyword
 * Hummingbird(myMethod1)
 *
 * // create an instance and add optional properties
 * Hummingbird(myMethod2, {
 * 	// flaps per second / iteration / speed
 * 	fps: 18,
 * 	// how to interpret fps value: SECONDS or FLAPS. default: FLAPS
 * 	fpsIn: FLAPS,
 * 	// how long the method will called for
 * 	lifeSpan: 3,
 * 	// how to interpret fps lifeSpan: SECONDS or FLAPS. default: SECONDS
 * 	lifeSpanIn: SECONDS,
 * 	// if lifeSpan, add a handler
 * 	onComplete: function(a, b) {
 * 		console.log(a, b) // true, 'foo'
 * 	},
 * 	// provide params to the handler
 * 	onCompleteParams: [true, 'foo']
 * })
 *
 * // creation returns an instance if specific targeting needed
 * const myBird = Hummingbird(myMethod3)
 *
 * // Hummingbird has global methods to control all instances
 * // Pause the whole engine so no methods are called
 * Hummingbird.sleep()
 *
 * // Then start it back up
 * Hummingbird.wake()
 *
 * // or remove a method later
 * Hummingbird.release(this, myFunctionA)
 */
const Hummingbird = function(handler, args) {
	args = args || {}
	const T = this

	// allow for omitting 'new'
	if (!(T instanceof Hummingbird)) {
		return new Hummingbird(handler, args)
	}

	T.handler = handler

	// Optional args:
	// TODO - change 'fps' to 'speed'
	T.fpsIn = args.fpsIn || FLAPS
	T._fps = calculateFPS(args.fps || 30, T.fpsIn)
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
	fps: function(val) {
		const T = this
		if (val & isNumber(val)) {
			releaseSingle(T)
			T._fps = val
			enlist(T, true)
			return T
		} else {
			return T._fps
		}
	},
	sleep: function() {
		sleep(this)
		return this
	},
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
	release: function() {
		const T = this
		if (!T.isReleased) {
			releaseSingle(T)
			T.isReleased = true
		}
		return T
	},
	toString: () => 'Hummingbird',
	squawk: function() {
		const T = this
		// TODO - change this to pass Hummingbird?
		T.handler.call(T.scope, T)
		return T
	},
	sleepLife: function() {
		this._toggleLife(true)
	},
	wakeLife: function() {
		this._toggleLife(false)
	},
	_toggleLife: function(val) {
		if (this.lifeTimer) {
			this.lifeTimer.paused = val
		}
	}
}

Hummingbird.release = release
Hummingbird.sleep = sleep
Hummingbird.wake = wake
//Hummingbird.defaultFps

export default Hummingbird
