import { milliPerFrame } from './utils'

function Category(fps) {
	const T = this
	T.pool = []
	T.fps = fps

	T._frameTime = milliPerFrame(T.fps)
	T._prevTime = 0
	T._startTime = 0
	T._nextTime = 0
	T._maxLag = 400
	T._shiftLag = 30
	T._paused = false
	T._prevCallTime = Date.now()

	T.diffTime = 0
}

Category.prototype = {
	tick: function() {
		const T = this
		if (!T._paused) {
			var willCall = false
			var now = Date.now()
			var diffTime = now - T._prevTime

			if (diffTime > T._maxLag) {
				T._startTime += diffTime - T._shiftLag
			}
			T._prevTime = now

			var elapsedTime = T._prevTime - T._startTime
			var future = elapsedTime - T._nextTime

			if (future > 0) {
				T._nextTime += future >= T._frameTime ? future : T._frameTime
				willCall = true

				// calculates the difference only from last call, not last update
				T.diffTime = now - T._prevCallTime
				T._prevCallTime = now
			}

			if (willCall) T.handle()
		}
	},

	handle: function() {
		const T = this
		for (var i = 0; i < T.pool.length; i++) {
			var obj = T.pool[i]
			if (!obj.isPaused) {
				obj.handler.call(obj.scope, this)
			}
		}
	}
}

export default Category
