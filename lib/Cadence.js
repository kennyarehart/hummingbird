import { milliPerFrame } from 'hummingbird/lib/utils'

function Cadence(fps) {
	const T = this
	T.pool = []
	T.fps = fps
	T.paused = false

	T._timePerFrame = milliPerFrame(T.fps)
	T._timeTotal = 0
	T._prevTime = 0
	T._nextTime = 0
	T._maxLag = 400
	T._shiftLag = 30
	T._prevCallTime = Date.now()

	T.diffTime = 0 // ?
}

Cadence.prototype = {
	reset: function() {
		// TODO ?
	},
	tick: function() {
		const T = this
		if (!T.paused) {
			let willCall = false
			const now = Date.now()
			const localTimeDiff = now - T._prevTime

			if (localTimeDiff > T._maxLag) {
				T._timeTotal += localTimeDiff - T._shiftLag
			}
			T._prevTime = now

			const elapsedTime = T._prevTime - T._timeTotal
			const future = elapsedTime - T._nextTime

			if (future > 0) {
				T._nextTime += future >= T._timePerFrame ? future : T._timePerFrame
				willCall = true

				// calculates the difference only from last call, not last update
				T.diffTime = now - T._prevCallTime // ?
				
				T._prevCallTime = now
			}

			if (willCall) T.handle()
		}
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
