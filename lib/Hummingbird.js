import { enlist, release, releaseSingle, sleep, wake, createTimer } from './manager'

const Hummingbird = function(handler, args) {
	args = args || {}
	const T = this

	// allow for omitting 'new'
	if (!(T instanceof Hummingbird)) {
		return new Hummingbird(handler, args)
	}

	T.handler = handler
	T._fps = args.fps || 30
	T.scope = args.scope || null
	T.name = args.name || 'hb-' + Math.round(Date.now() * Math.random())

	if (args.lifeSpan) {
		T.lifeSpan = args.lifeSpan
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
		sleep(this)
		return this
	},
	wake: function() {
		const T = this
		if (!T.isReleased) {
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
	squawk: function(cadence) {
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
