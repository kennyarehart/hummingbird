import { enlist, release, releaseSingle, sleep, sleepSingle, wake } from './manager'

const Hummingbird = function(handler, args) {
	args = args || {}
	const T = this
	
	T.handler = handler
	T._fps = args.fps || 30
    T.scope = args.scope || null
	T.id = 'hb-' + Math.round(Date.now() * Math.random())
	T._paused = false

	// init
	enlist(T)
}

Hummingbird.prototype = {
	fps: function(val) {
		const T = this
		if (val) {
			releaseSingle(T)
			T._fps = val
			enlist(T)
			return T
		} else {
			return T._fps
		}		
	},
	sleep: function() {
		const T = this
		T._paused = true
		// remove from cadence
		sleepSingle(T)
		// check the manager if all are paused
		return T
	},
	wake: function() {
		const T = this
		T._paused = false
		// add back to cadence
		enlist(T)
		return T
	},
	squawk: function(cadence) {
        const T = this
        if (!T._paused) { // possibly unnecessary
            T.handler.call(T.scope, cadence)
        }
	},
	release: function() {
		const T = this
		releaseSingle(T)
		return T
	}
}

Hummingbird.spawn = (handler, args) => new Hummingbird(handler, args)
Hummingbird.release = release
Hummingbird.sleep = sleep
Hummingbird.wake = wake

export default Hummingbird
