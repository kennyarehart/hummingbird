import { milliPerFrame, arrayContains } from './utils'
import Timeblock from './Timeblock'

function Cadence(fps) {
	const T = this
	T.pool = []
	T._sleepPool = []
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
		this.paused = this.engine.paused = true
		// no need to loop the children
	},
	wake: function() {
		const T = this
		T.paused = T.engine.paused = false
		// loop children
		if (T._sleepPool.length > 0) {
			for (var i = 0, k = T._sleepPool.length; i < k; i++) {
				T.pool.push(T._sleepPool[i])
			}
			T._sleepPool.length = 0
		}
	},
	tick: function() {
		this.engine.tick()
	},
	handle: function() {
		const T = this
		for (var i = 0, k = T.pool.length; i < k; i++) {
			// single Hummingbird instance
			T.pool[i].squawk(T)
		}
	},
	// check both arrays if it has the Hummingbird instance
	hasSingle: function(singleBird) {
		if (arrayContains(singleBird, this.pool)) {
			return true
		} else {
			if (arrayContains(singleBird, this._sleepPool)) {
				return true
			}
		}
		return false
	},
	isEmpty: function() {
		return this.pool.length === 0 && this._sleepPool.length === 0
	}
}

export default Cadence
