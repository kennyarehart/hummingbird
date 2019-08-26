import { milliPerFrame } from './utils'
import Timeblock from './Timeblock'

function Cadence(fps) {
	const T = this
	T.pool = []
	T.fps = fps
	T.paused = false

	const time = milliPerFrame(T.fps)
	T.timer = new Timeblock(time, T.handle, T, true)
}

Cadence.prototype = {
	reset: function() {
		// TODO ?
	},
	sleep: function() {
		this.paused = true
		this.timer.paused = true
	},
	wake: function() {
		this.paused = false
		this.timer.paused = false
	},
	tick: function() {
		this.timer.tick()
	},
	handle: function() {
		const T = this
		for (var i = 0; i < T.pool.length; i++) {
			// single Hummingbird instance
			T.pool[i].squawk(T)
		}
	}
}

export default Cadence
