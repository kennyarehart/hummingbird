import { milliPerFrame, removeFromArray } from './utils'
import Timeblock from './Timeblock'
import Pools from './Pools'

function Cadence(fps) {
	const T = this
	// T.pool = []
	// T._sleepPool = []
	T.POOLS = new Pools()
	T.fps = fps

	const timePerFrame = milliPerFrame(T.fps)
	T.engine = new Timeblock(timePerFrame, T.handle, T, true)
}

Cadence.prototype = {
	sleep: function() {
		this.engine.paused = true
		// no need to loop the children
	},
	wake: function() {
		const T = this
		T.engine.paused = false
		// loop children
		// if (T._sleepPool.length > 0) {
		// 	for (var i = 0, k = T._sleepPool.length; i < k; i++) {
		// 		T.pool.push(T._sleepPool[i])
		// 	}
		// 	T._sleepPool.length = 0
		// }
		T.POOLS.enableAll(item => {
			if (item.lifeTimer) {
				item.lifeTimer.paused = false
			}
		})
	},
	tick: function() {
		this.engine.tick()
	},
	handle: function() {
		const T = this
		// for (var i = 0, k = T.pool.length; i < k; i++) {
		// 	// single Hummingbird instance
		// 	T.pool[i].squawk(T)
		// }
		for (var i = 0, k = T.POOLS.active.length; i < k; i++) {
			T.POOLS.active[i].squawk(T)
		}
	},
	sleepSingle: function(singleBird) {
		const T = this
		// removeFromArray(singleBird, T.pool)
		// T._sleepPool.push(singleBird)
		// if (T.pool.length === 0) {
		// 	T.sleep()
		// }
		T.POOLS.disable(singleBird)
		if (T.POOLS.active.length === 0) {
			T.sleep()
		}
	},
	wakeSingle: function(singleBird) {
		const T = this
		// attempt to remove from sleep pool, if so move to active pool
		// if (removeFromArray(singleBird, T._sleepPool)) {
		// 	T.pool.push(singleBird)
		// }
		T.POOLS.enable(singleBird)
		// if you wake any birds, you must wake the cadence?
		T.engine.paused = false
	}
}

export default Cadence
