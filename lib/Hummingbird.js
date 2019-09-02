import { enlist, release, releaseSingle, sleep, sleepSingle, wake, createTimer } from './manager'

const Hummingbird = function(handler, args) {
	args = args || {}
	const T = this

	T.handler = handler
	T._fps = args.fps || 30
	T.scope = args.scope || null
	T.name = args.name || 'hb-' + Math.round(Date.now() * Math.random())

	if (args.lifeSpan) {
		T.lifeSpan = args.lifeSpan
		T.lifeTimer = createTimer(T)
	}

	T._parent = null

	// init
	enlist(T)
}

Hummingbird.prototype = {
	fps: function(val) {
		const T = this
		if (val) {
			releaseSingle(T)
			T._fps = val
			enlist(T, true)
			return T
		} else {
			return T._fps
		}
	},
	sleep: function() {
		// remove from cadence
		sleepSingle(this)
		return this
	},
	wake: function() {
		// add back to cadence
		enlist(this, false, true)
		return this
	},
	release: function() {
		releaseSingle(this)
		return this
	},
	toString: () => 'Hummingbird',
	squawk: function(cadence) {
		const T = this
		// TODO - change this to pass Hummingbird?
		T.handler.call(T.scope, cadence)
		return T
	}
}

Hummingbird.spawn = (handler, args) => new Hummingbird(handler, args)
Hummingbird.release = release
Hummingbird.sleep = sleep
Hummingbird.wake = wake
//Hummingbird.defaultFps

export default Hummingbird
