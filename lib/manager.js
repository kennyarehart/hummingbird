import Cadence from './Cadence'
import { isHummingBird, isNumber } from './utils'
import './request-animation-frame'

// ----------------------------------------------------------------------------------------------------
let _isPaused = true
let _isActive = true
let _cadences = {}
let _sleepPool = []
let _raf = undefined

// ----------------------------------------------------------------------------------------------------
// PUBLIC METHODS
export const enlist = singleBird => {
    console.log('singleBird', singleBird, singleBird._fps)
    const fps = singleBird.fps()

    if (!_cadences[fps]) {
        _cadences[fps] = new Cadence(fps)
    }
   
    const pool = _cadences[fps].pool
    // check if it already exists in this cadence
    for (var i = 0; i < pool.length; i++) {
        if (pool[i] === singleBird) {
            return singleBird
        }
    }

    pool.push(singleBird)

    if (_isActive) wake('enlist')

    return singleBird
}

// possibly pass in:
// - instance
// - fps
// - id?
// - handler?
export const release = (...args) => {
    console.log('release(), args:', args, '| args.length:', args.length)
    // check if no args first, release everything
    if (args.length === 0) {
        for (var key in _cadences) delete _cadences[key]
        _sleepPool.length = 0
    } else {
        for (var i = 0, k = args.length; i < k; i++) {
            console.log('>', i, '|', args[i], '|', isHummingBird(args[i]))
            if (isHummingBird(args[i])) {
                if (!releaseSingle(args[i], true)) {
                    // was already released, so check sleepPool
                    loop1: for (var a = _sleepPool.length - 1, b = 0; a >= b; a--) {
                        // if fps match OR no target 
                        if (args[i] === _sleepPool[a]) {
                            // remove it from sleep pool
                            _sleepPool.splice(a, 1)
                            break loop1
                        }
                    }
                }
            } else if (isNumber(args[i])) {
                // remove the whole cadence instance 
                delete _cadences[args[i]]
                // then sort the sleepPool by fps
                _sleepPool.sort((a, b) => a.fps() - b.fps())
                // iterate backwards removing matches
                for (var a = _sleepPool.length - 1, b = 0; a >= b; a--) {
                    if (args[i] === _sleepPool[a].fps()) {
                        // remove it from sleep pool
                        _sleepPool.splice(a, 1)
                    }
                }
            } else {
                console.warn(`release("${item}") not a valid type/target`)
            }
            console.log('_sleepPool:', _sleepPool)
        }
    }
    checkCadenceTotal()
}

// only interanlly called from Hummingbird instance
export const releaseSingle = (singleBird, skipFinalCheck) => {
    console.log('releaseSingle()', singleBird, '|', _cadences)
    const singelCadence = _cadences[singleBird.fps()]
    if (singelCadence) {
        const singleCadencePool = singelCadence.pool
        for (var i = 0; i < singleCadencePool.length; i++) {
            if (singleCadencePool[i] === singleBird) {
                singleCadencePool.splice(i, 1)
                break
            }
        }

        // removes the Category object with no handlers
        if (singleCadencePool.length === 0) {
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
        for (var i = 0, k = args.length; i < k; i++) {
            const item = args[i]
            if (isHummingBird(item)) {
                sleepSingle(item, true) //item.sleep()
                _isPaused = true
            } else if (isNumber(item)) {
                if (_cadences[item]) {
                    _cadences[item].sleep()
                    _isPaused = true
                }
            } else {
                console.warn(`sleep("${item}") not a valid type/target`)
            }
        }
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
        _isPaused = true
    }

    if (_isPaused) {
        console.log('CANCEL RAF ---------------')
        _isActive = false
        window.cancelAnimationFrame(_raf)
    }
}

// used internally by Hummingbird instance
export const sleepSingle = singleBird => {
    _sleepPool.push(singleBird)
    releaseSingle(singleBird)
}

export const wake = (...args) => {
    console.log('\n\t\twake()\n\n')
    // store current paused to avoid multiple/stacked RAF calls
    var _currentlyPaused = _isPaused
    if (args.length > 0) {
        if (args[0] === 'enlist') {
            // called when a new hummingbird is created
            _isPaused = false
        } else {
            // check each arg for type. then do something
            for (var i = 0, k = args.length; i < k; i++) {
                const item = args[i]
                if (isHummingBird(item)) {
                    item.wake()
                    _isPaused = false  
                } else if (isNumber(item)) {
                    // is a number
                    wakeSingles(item)

                    // then wake that cadence
                    if (_cadences[item]) {
                        _cadences[item].wake()  
                        _isPaused = false                            
                    }
                } else {
                    console.warn(`wake("${item}") not a valid type/target`)
                }
            }
        } 
    } else {
        // wake everything
        for (var d in _cadences) {
            _cadences[d].wake()
        }

        wakeSingles()

        _isPaused = false
    }

    if (_currentlyPaused) {
        console.log('START RAF -----------')
        _isActive = true
        _raf = window.requestAnimationFrame(handleNext)
    }
}

// ----------------------------------------------------------------------------------------------------
// PRIVATE/HANDLER METHODS
function checkCadenceTotal() {
    if (Object.keys(_cadences).length === 0) {
        sleep()
        _isActive = true
    }
}

function wakeSingles(fpsTarget) {
    // go through sleep pool to wake individuals
    for (var i = _sleepPool.length - 1, k = 0; i >= k; i--) {
        // if fps match OR no target 
        if (fpsTarget === _sleepPool[i].fps() || fpsTarget === undefined) {
            _sleepPool[i].wake()
            // remove it from sleep pool
            _sleepPool.pop()
        }
    }
}

function handleNext() {
    // console.log('handleNext()')
    // console.log('handleNext(), _isPaused:', _isPaused, '| _isActive:', _isActive, '| _cadences:', _cadences)
    if (!_isPaused) {
        for (var h in _cadences) {
            _cadences[h].tick()
        }

        if (Object.keys(_cadences).length === 0) {
            console.warn('tick()')
        }

        window.requestAnimationFrame(handleNext)
    }
}

