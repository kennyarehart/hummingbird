import Cadence from './Cadence'
import Timeblock from './Timeblock'
import { iterateConditional, removeFromArray, arrayFindByKey, arrayRemoveByKey } from './utils'
import './request-animation-frame'

// ----------------------------------------------------------------------------------------------------
let _isPaused = true
let _isActive = true
let _cadencePool = []
let _raf = undefined
let _timers = []

// ----------------------------------------------------------------------------------------------------
// PUBLIC METHODS
export const enlist = (singleBird, skipFinalCheck, fromWake) => {
	// console.log('enlist()', singleBird, singleBird._fps)
	const fps = singleBird.fps()

	let singleCadence
	for (var i = 0, k = _cadencePool.length; i < k; i++) {
		if (_cadencePool[i].fps === fps) {
			singleCadence = _cadencePool[i]
			break
		}
	}
	if (!singleCadence) {
		singleCadence = new Cadence(fps)
		_cadencePool.push(singleCadence)
	}

	console.log('singleCadence:', singleCadence)

	// assign the cadence to the single bird for ref
	singleBird._parent = singleCadence

	// TODO - SHOULD NOT BE CALLED ON CREATE?
	// un-pause the potential life timer
	toggleLife(singleBird, false)

	if (fromWake) {
		// move from the cadence sleep pool to active pool
		removeFromArray(singleBird, singleCadence._sleepPool)
	}

	// check if it already exists in this cadence
	if (singleCadence.hasSingle(singleBird)) {
		return singleBird
	}

	// TODO - possibly add to a sleep pool?
	singleCadence.pool.push(singleBird)

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
		_cadencePool.length = 0
		// TODO - iterate through pool to destroy refences for garbage collection?
	} else {
		iterateConditional(
			item => {
				releaseSingle(item, true)
			},
			item => {
				// remove the whole cadence instance
				arrayRemoveByKey(_cadencePool, 'fps', item)
			},
			...args
		)
	}
	checkCadenceTotal()
}

// only interanlly called from Hummingbird instance
export const releaseSingle = (singleBird, skipFinalCheck) => {
	console.log(':: releaseSingle() ::', singleBird)
	// TODO - unnecessary check as all single birds should have a parent when enlisted?
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
			removeFromArray(singleCadence, _cadencePool)
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
				const found = arrayFindByKey(_cadencePool, 'fps', item)
				if (found) {
					found.sleep()
					_isPaused = true
				}
			},
			...args
		)
		// assume the whole system is paused THEN
		// loop of each cadence checking their paused state
		for (var i = 0, k = _cadencePool.length; i < k; i++) {
			if (_cadencePool[i].paused) {
				_isPaused = false
				break
			}
		}
	} else {
		// sleep everything
		for (var i = 0, k = _cadencePool.length; i < k; i++) {
			_cadencePool[i].sleep()
		}

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
	console.log(':: sleepSingle() ::')
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
					const found = arrayFindByKey(_cadencePool, 'fps', item)
					if (found) {
						found.wake()
						_isPaused = false
					}
				},
				// items
				...args
			)
		}
	} else {
		// wake everything
		for (var i = 0, k = _cadencePool.length; i < k; i++) {
			_cadencePool[i].wake()
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
	// if (Object.keys(_cadences).length === 0) {
	if (_cadencePool.length === 0) {
		sleep()
		_isActive = true
	}
}

function handleNext() {
	// console.log('handleNext()')
	// console.log('handleNext(), _isPaused:', _isPaused, '| _isActive:', _isActive, '| _cadences:', _cadences)
	if (!_isPaused) {
		for (var i = 0, k = _cadencePool.length; i < k; i++) {
			_cadencePool[i].tick()
		}

		for (var i = 0, k = _timers.length; i < k; i++) {
			_timers[i].tick()
		}

		// this SHOULD never be hit, but warns that RAF is still running with no cadences
		if (_cadencePool.length === 0) {
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
