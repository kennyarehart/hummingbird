import { flutter, release, sleep, wake } from './manager'

const Hummingbird = function(handler, args) {
	args = args || {}
	const T = this
	
	T.handler = handler
	T._fps = args.fps || 30
    T.scope = args.scope || null
	T.isPaused = false
	T.id = 'hb-' + Math.round(Date.now() * Math.random())

	// init
	flutter(T)
}

Hummingbird.prototype = {
	squawk: function() {
        const T = this
        if (!T.isPaused) {
            T.handler.call(T.scope)
        }
    }
}

Hummingbird.flutter = (handler, args) => {
	return new Hummingbird(handler, args)
}
Hummingbird.release = release
Hummingbird.sleep = sleep
Hummingbird.wake = wake

export default Hummingbird
