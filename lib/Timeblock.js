function Timeblock(time, handler, scope, loop) {
    console.log('Timeblock()', time, handler !== undefined, loop)
    const T = this
	T.paused = false
	T.scope = scope
    T.loop = loop !== false

    T._timePerFrame = time
    T._handler = handler

	T._timeTotal = 0
	T._prevTime = 0
	T._nextTime = 0
	T._maxLag = 400
	T._shiftLag = 30
    // T._prevCallTime = Date.now()
    
    T._isActive = true
}

Timeblock.prototype = {
    tick: function() {
        const T = this
		if (!T.paused && T._isActive) {
			const now = Date.now()

			const localTimeDiff = now - T._prevTime
			if (localTimeDiff > T._maxLag) {
				T._timeTotal += localTimeDiff - T._shiftLag
			}
			T._prevTime = now

			const elapsedTime = now - T._timeTotal
			const future = elapsedTime - T._nextTime

			if (future > 0) {
				T._nextTime += future >= T._timePerFrame ? future : T._timePerFrame
				
				T._handler.call(T.scope)
				
                // T._prevCallTime = now
                if (!T.loop) {
                    T._isActive = false
                }
			}
		}
    }
}

export default Timeblock