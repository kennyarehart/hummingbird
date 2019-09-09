import { enlist, release, releaseSingle, sleep, wake, createTimer, addTimer } from './manager'
import { calculateFPS, isNumber, toggleLife } from './utils'
import { SECONDS, FLAPS } from './constants'

const Hummingbird = function(handler, args) {
	args = args || {}
	const T = this

	// allow for omitting 'new'
	if (!(T instanceof Hummingbird)) {
		return new Hummingbird(handler, args)
	}

	T.handler = handler

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
