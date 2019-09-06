import Cadence from './Cadence'
import Timeblock from './Timeblock'
import { iterateConditional, arrayRemove, arrayFindByKey, arrayRemoveByKey } from './utils'
import 'raf-polyfill'

// ----------------------------------------------------------------------------------------------------
let _isPaused = true
let _isActive = true
let _cadencePool = []
let _raf = undefined
let _timers = []

// ----------------------------------------------------------------------------------------------------
// PUBLIC METHODS
export const enlist = (singleBird, skipFinalCheck, fromWake) => {
	// TODO - possibly remove skipFinalCheck as unnecessary?
	const fps = singleBird.fps()

	// find the cadence from active pool
	let singleCadence = arrayFindByKey(_cadencePool, 'fps', fps)
	// if none found, make a new one
	if (!singleCadence) {
		singleCadence = new Cadence(fps)
		_cadencePool.push(singleCadence)
	}

	// assign the cadence to the single bird for ref
	singleBird._parent = singleCadence

	// TODO - SHOULD NOT BE CALLED ON CREATE?
	//      - now unnecessary?
	// un-pause the potential life timer
	toggleLife(singleBird, false)

	if (fromWake) {
		// move from the single cadence sleep pool to active pool
		singleBird._parent.wakeSingle(singleBird)
		return singleBird
	}

	// check if it already exists in this cadence?
	// if (singleCadence.hasSingle(singleBird)) {
	// 	console.log('hasSingle:')
	// 	return singleBird
	// }

	singleCadence.enlist(singleBird)

	if (_isActive || !skipFinalCheck) wake('isEnlist')

	return singleBird
}

// possibly pass in:
// - instance
// - fps
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
	const singleCadence = singleBird._parent
	if (singleCadence) {
		singleCadence.releaseSingle(singleBird)

		// removes the Category object with no handlers
		// TODO - check both pools?
		if (singleCadence.isIdle()) {
			arrayRemove(_cadencePool, singleCadence)
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
			singleBird => {
				singleBird._parent.sleepSingle(singleBird)
				// toggleLife(singleBird, true)
			},
			// Number for Cadence
			item => {
				const singeCadence = arrayFindByKey(_cadencePool, 'fps', item)
				if (singeCadence) {
					singeCadence.sleep()
				}
			},
			...args
		)
		_isPaused = true

		// assume the whole system is paused THEN
		// loop of each cadence checking their paused state
		for (var i = 0, k = _cadencePool.length; i < k; i++) {
			if (!_cadencePool[i].engine.paused) {
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
					enlist(item, true, true)
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
		_raf = window.requestAnimationFrame(handleRAF)
	}
}

export const createTimer = singleBird => {
	// add a timer to the pool
	const lifeMilli = singleBird.lifeSpan * 1000
	const singleTimer = new Timeblock(lifeMilli, handleTimer, singleBird)
	// _timers.push(singleTimer)
	return singleTimer
}

export const addTimer = singleTimer => {
	_timers.push(singleTimer)
}

// ----------------------------------------------------------------------------------------------------
// PRIVATE/HANDLER METHODS
function checkCadenceTotal() {
	if (_cadencePool.length === 0) {
		sleep()
		_isActive = true
	}
}

function handleRAF() {
	// console.log('handleRAF()')
	// console.log('handleRAF(), _isPaused:', _isPaused, '| _isActive:', _isActive, '| _cadences:', _cadencePool)
	if (!_isPaused) {
		// loop through arrays backwards incase of removals mid loop
		for (var i = _cadencePool.length - 1; i >= 0; i--) {
			_cadencePool[i].tick()
		}
		// especially timers
		for (var i = _timers.length - 1; i >= 0; i--) {
			_timers[i].tick()
		}

		// this SHOULD never be hit, but warns that RAF is still running with no cadences
		if (_cadencePool.length === 0) {
			console.warn('handleRAF()')
		}

		window.requestAnimationFrame(handleRAF)
	}
}

function toggleLife(singleBird, val) {
	if (singleBird.lifeTimer) {
		singleBird.lifeTimer.paused = val
	}
}

function handleTimer(singleTimer) {
	console.log(':: handleTimer() ::', _timers.length, singleTimer)
	// remove the timer from pool
	arrayRemove(_timers, singleTimer)

	// release the singleBird
	this.release()
}
