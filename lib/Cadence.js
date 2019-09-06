import { millisecondsPerFrame } from './utils'
import Timeblock from './Timeblock'
import Pools from './Pools'

function Cadence(speed) {
	const T = this
	T.speed = speed

	const timePerFrame = millisecondsPerFrame(T.speed)
	T.engine = new Timeblock(timePerFrame, T.handle, T, true)
	T.pools = new Pools()
}

Cadence.prototype = {
	enlist: function(singleBird) {
		this.pools.add(singleBird)
	},
	sleep: function() {
		const T = this
		T.engine.paused = true
		// loop through children
		T.pools.disableAll(singleBird => {
			singleBird.sleepLife()
		})
	},
	wake: function() {
		const T = this
		T.engine.paused = false
		// loop children
		T.pools.enableAll(singleBird => {
			singleBird.wakeLife()
		})
	},
	tick: function() {
		this.engine.tick()
	},
	handle: function() {
		for (var i = 0, k = this.pools.active.length; i < k; i++) {
			this.pools.active[i].squawk()
		}
	},
	sleepSingle: function(singleBird) {
		const T = this
		T.pools.disable(singleBird)
		singleBird.sleepLife()
		if (T.pools.active.length === 0) {
			T.sleep()
		}
	},
	wakeSingle: function(singleBird) {
		const T = this
		T.pools.enable(singleBird)
		// if you wake any birds, you must wake the cadence?
		T.engine.paused = false
	},
	releaseSingle: function(singleBird) {
		this.pools.remove(singleBird)
	},
	isIdle: function() {
		return this.pools.active.length === 0 && this.pools.inactive.length === 0
	}
}

export default Cadence
