import Category from './Category'
import SingleBird from './SingleBird'
import './request-animation-frame'

function Hummingbird() {
	const T = this
	
	let _isPaused = true
	let _isActive = true
	let _categories = {}
	let _raf = undefined

	// -----------------------------------------------------------------------------------------------
	// PUBLIC METHODS
	T.flutter = (scope, handler, fps) => {
		fps = fps || 30
		if (!_categories[fps]) {
			_categories[fps] = new Category(fps)
		}

		var pool = _categories[fps].pool
		for (var i = 0; i < pool.length; i++) {
			if (pool[i].scope === scope && pool[i].handler === handler) {
				return
			}
        }
        const single = new SingleBird(handler, { scope, fps })
        pool.push(single)

        if (_isActive) T.wake()
        
        return single
	}

	T.release = (scope, handler, fps) => {
        // possibly pass in:
        // - instance
        // - id
        // - handler
        // - scope?
        // - fps?

		for (var key in _categories) {
			// if fps is provided, only look in that Category for handlers
			if (fps && key != fps) {
				continue
			}
			// otherwise, remove all references to that handler

			var pool = _categories[key].pool
			for (var i = 0; i < pool.length; i++) {
				if (pool[i].scope === scope && pool[i].handler === handler) {
					pool.splice(i, 1)
					break
				}
			}

			// removes the Category object with no handlers
			if (pool.length === 0) {
				delete _categories[key]
			}
		}

		if (Object.keys(_categories).length === 0) {
			T.sleep()
			_isActive = true
		}
	}

	T.sleep = (...args) => {
		if (args.length > 0) {
			for (var i = 0; i < args.length; i++) {
				var fpsTarget = args[i]
				if (_categories[fpsTarget]) {
					_categories[fpsTarget]._paused = true
					_isPaused = true
				}
			}
			for (var d in _categories) {
				if (!_categories[d]._paused) {
					_isPaused = false
					break
				}
			}
		} else {
            for (var b in _categories) {
                _categories[b]._paused = true
            }
			_isPaused = true
		}

		if (_isPaused) {
			_isActive = false
			window.cancelAnimationFrame(_raf)
		}
	}

	T.wake = (...args) => {
		var _currentlyRunning = !_isPaused
		if (args.length > 0) {
			for (var i = 0; i < args.length; i++) {
				var fpsTarget = args[i]
				if (_categories[fpsTarget]) {
					_categories[fpsTarget]._paused = false
					_isPaused = false
				}
			}
		} else {
			for (var d in _categories) _categories[d]._paused = false
			_isPaused = false
		}

		if (!_currentlyRunning) {
			_isActive = true
			_raf = window.requestAnimationFrame(handleNext)
		}
	}

	// -----------------------------------------------------------------------------------------------
	// PRIVATE METHODS
	const handleNext = () => {
		if (!_isPaused) {
			for (var h in _categories) {
				_categories[h].tick()
			}

			window.requestAnimationFrame(handleNext)
		}
	}
}

export default new Hummingbird()
