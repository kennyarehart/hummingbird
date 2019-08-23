import { spawn, release, releaseSingle, sleep, wake } from './manager'

const Hummingbird = function(handler, args) {
	args = args || {}
	const T = this
	
	T.handler = handler
	T.fps = args.fps || 30
    T.scope = args.scope || null
	T.id = 'hb-' + Math.round(Date.now() * Math.random())
	T._isPaused = false

	// init
	spawn(T)
}

Hummingbird.prototype = {
	sleep: function() {
		const T = this
		T._isPaused = true
		return T
	},
	wake: function() {
		const T = this
		T._isPaused = false
		return T
	},
	squawk: function() {
        const T = this
        if (!T._isPaused) {
            T.handler.call(T.scope)
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
