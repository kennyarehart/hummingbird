import { milliPerFrame } from './utils'
import Timeblock from './Timeblock'

function Cadence(fps) {
	const T = this
	T.pool = []
	T.fps = fps
	T.paused = false

	const timePerFrame = milliPerFrame(T.fps)
	T.engine = new Timeblock(timePerFrame, T.handle, T, true)
}

Cadence.prototype = {
	reset: function() {
		// TODO ?
	},
	sleep: function() {
		this.paused = true
		this.engine.paused = true
	},
	wake: function() {
		this.paused = false
		this.engine.paused = false
	},
	tick: function() {
		this.engine.tick()
	},
	handle: function() {
		const T = this
		for (var i = 0, k =  T.pool.length; i < k; i++) {
			// single Hummingbird instance
			T.pool[i].squawk(T)
		}
	}
}

export default Cadence
