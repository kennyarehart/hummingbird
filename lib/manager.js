import Cadence from './Cadence'
import Timeblock from './Timeblock'
import { iterateConditional, removeFromArray } from './utils'
import './request-animation-frame'

// ----------------------------------------------------------------------------------------------------
let _isPaused = true
let _isActive = true
let _cadences = {}
let _cadencePool = []
let _raf = undefined
let _timers = []

// ----------------------------------------------------------------------------------------------------
// PUBLIC METHODS
export const enlist = (singleBird, skipFinalCheck, fromWake) => {
	// console.log('enlist()', singleBird, singleBird._fps)
	const fps = singleBird.fps()

	if (!_cadences[fps]) {
		_cadences[fps] = new Cadence(fps)
	}

	// assign the cadence to the single bird for ref
	singleBird._parent = _cadences[fps]

	// TODO - SHOULD NOT BE CALLED ON CREATE?
	// un-pause the potential life timer
	toggleLife(singleBird, false)

	if (fromWake) {
		// move from the cadence sleep pool to active pool
		removeFromArray(singleBird, _cadences[fps]._sleepPool)
	}

	// check if it already exists in this cadence

	// const pool = _cadences[fps].pool
	// for (var i = 0, k = pool.length; i < k; i++) {
	// 	if (pool[i] === singleBird) {
	// 		return singleBird
	// 	}
	// }
	if (_cadences[fps].hasSingle(singleBird)) {
		return singleBird
	}

	// TODO - possibly add to sleep pool?
	_cadences[fps].pool.push(singleBird)

	if (_isActive || !skipFinalCheck) wake('isEnlist')

	return singleBird
}

// possibly pass in:
// - instance
// - fps
// - id?
// - handler?
export const release = (...args) => {
	// console.log('release(), args:', args, '| args.length:', args.length)
	// check if no args first, release everything
	if (args.length === 0) {
		for (var key in _cadences) delete _cadences[key]
		// _sleepPool.length = 0
	} else {
		iterateConditional(
			item => {
				releaseSingle(item, true)
			},
			item => {
				// remove the whole cadence instance
				delete _cadences[item]
			},
			...args
		)
	}
	checkCadenceTotal()
}

// only interanlly called from Hummingbird instance
export const releaseSingle = (singleBird, skipFinalCheck) => {
	// console.log('releaseSingle()', singleBird, '|', _cadences)
	const singleCadence = singleBird._parent
	if (singleCadence) {
		// check active pool
		const singleCadencePool = singleCadence.pool
		// check the active pool first, if nothing returned check the sleep pool
		if (!removeFromArray(singleBird, singleCadence.pool)) {
			removeFromArray(singleBird, singleCadence._sleepPool)
		}

		// removes the Category object with no handlers
		console.log('singleCadence:', singleCadence)
		// TODO - add check for sleep pool length, but if you do it does not work?
		//      - needs a sleep-cadences
		if (singleCadencePool.length === 0) {
			// if (singleCadence.isEmpty()) {
			delete _cadences[singleBird.fps()]
		}
		if (!skipFinalCheck) {
			checkCadenceTotal()
		}
		return true
	} else {
		return false
	}
}

export const sleep = (...args) => {
	if (args.length > 0) {
		iterateConditional(
			// Hummingbird instance
			item => {
				sleepSingle(item, true)
				_isPaused = true
			},
			// Number for Cadence
			item => {
				if (_cadences[item]) {
					_cadences[item].sleep()
					_isPaused = true
				}
			},
			...args
		)
		// assume the whole system is paused THEN
		// loop of each cadence checking their paused state
		for (var d in _cadences) {
			if (!_cadences[d].paused) {
				_isPaused = false
				break
			}
		}
	} else {
		// sleep everything
		for (var b in _cadences) {
			_cadences[b].sleep()
		}

		console.log('>>>, _cadences:', _cadences)
		_isPaused = true
	}

	if (_isPaused) {
		console.log('----------- CANCEL RAF -----------')
		_isActive = false
		window.cancelAnimationFrame(_raf)
	}
}

// used internally by Hummingbird instance
export const sleepSingle = singleBird => {
	// move bird to sleepPool
	singleBird._parent._sleepPool.push(singleBird)

	releaseSingle(singleBird)

	toggleLife(singleBird, true)
}

export const wake = (...args) => {
	// store current paused to avoid multiple/stacked RAF calls
	var _currentlyPaused = _isPaused
	if (args.length > 0) {
		if (args[0] === 'isEnlist') {
			// called when a new hummingbird is created
			_isPaused = false
		} else {
			// check each arg for type
			iterateConditional(
				// is a Hummingbird
				item => {
					_isPaused = false
					enlist(item, true)
				},
				// is a Number
				item => {
					// then wake that cadence, it will wake any sleep pool
					if (_cadences[item]) {
						_cadences[item].wake()
						_isPaused = false
					}
				},
				// items
				...args
			)
		}
	} else {
		// wake everything
		for (var d in _cadences) {
			_cadences[d].wake()
		}
		_isPaused = false
	}

	// TODO - check if args is more than 0, set _osPaused = false once, here

	if (_currentlyPaused) {
		console.log('----------- START RAF -----------')
		_isActive = true
		_raf = window.requestAnimationFrame(handleNext)
	}
}

export const createTimer = singleBird => {
	// add a timer to the pool
	const lifeMilli = singleBird.lifeSpan * 1000
	const singleTimer = new Timeblock(lifeMilli, handleTimer, singleBird)
	_timers.push(singleTimer)
	return singleTimer
}

// ----------------------------------------------------------------------------------------------------
// PRIVATE/HANDLER METHODS
function checkCadenceTotal() {
	if (Object.keys(_cadences).length === 0) {
		sleep()
		_isActive = true
	}
}

function handleNext() {
	// console.log('handleNext()')
	// console.log('handleNext(), _isPaused:', _isPaused, '| _isActive:', _isActive, '| _cadences:', _cadences)
	if (!_isPaused) {
		// TODO - convert to array for speed
		for (var key in _cadences) {
			_cadences[key].tick()
		}

		for (var i = 0, k = _timers.length; i < k; i++) {
			_timers[i].tick()
		}

		if (Object.keys(_cadences).length === 0) {
			console.warn('tick()')
		}

		window.requestAnimationFrame(handleNext)
	}
}

function toggleLife(singleBird, val) {
	if (singleBird.lifeTimer) {
		singleBird.lifeTimer.paused = val
	}
}

function handleTimer(timer) {
	console.log('handleTimer()')
	// TODO - use util method
	// remove the timer from pool
	for (var i = _timers.length - 1, k = 0; i >= k; i++) {
		if (_timers[i] === timer) {
			_timers.splice(i, 1)
			break
		}
	}

	// release the singleBird
	this.release()
}
