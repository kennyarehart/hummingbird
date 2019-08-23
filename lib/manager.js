import Cadence from 'hummingbird/lib/Cadence'
import './request-animation-frame'

let _isPaused = true
let _isActive = true
let _cadences = {}
let _raf = undefined

// -----------------------------------------------------------------------------------------------
// PUBLIC METHODS
export const spawn = (singleBird) => {
    console.log('singleBird', singleBird, singleBird._fps)
    const fps = singleBird.fps

    if (!_cadences[fps]) {
        _cadences[fps] = new Cadence(fps)
    }
   
    var pool = _cadences[fps].pool
    // check if it already exists in this category?
    // for (var i = 0; i < pool.length; i++) {
    //     if (pool[i].scope === scope && pool[i].handler === handler) {
    //         return
    //     }
    // }

    pool.push(singleBird)

    if (_isActive) wake()

    return singleBird
}

export const releaseSingle = singleBird => {
    const singleCadence = _cadences[singleBird.fps].pool
    for (var i = 0; i < singleCadence.length; i++) {
        if (singleCadence[i] === singleBird) {
            singleCadence.splice(i, 1)
            break
        }
    }
}

export const release = (handler, fps, scope) => {
    // possibly pass in:
    // - instance
    // - id
    // - handler
    // - scope?
    // - fps?

    for (var key in _cadences) {
        // if fps is provided, only look in that Category for handlers
        if (fps && key != fps) {
            continue
        }
        // otherwise, remove all references to that handler

        var pool = _cadences[key].pool
        for (var i = 0; i < pool.length; i++) {
            if (pool[i].scope === scope && pool[i].handler === handler) {
                pool.splice(i, 1)
                break
            }
        }

        // removes the Category object with no handlers
        if (pool.length === 0) {
            delete _cadences[key]
        }
    }

    if (Object.keys(_cadences).length === 0) {
        sleep()
        _isActive = true
    }
}

export const sleep = (...args) => {
    if (args.length > 0) {
        for (var i = 0; i < args.length; i++) {
            var fpsTarget = args[i]
            if (_cadences[fpsTarget]) {
                _cadences[fpsTarget].paused = true
                _isPaused = true
            }
        }
        for (var d in _cadences) {
            if (!_cadences[d].paused) {
                _isPaused = false
                break
            }
        }
    } else {
        for (var b in _cadences) {
            _cadences[b].paused = true
        }
        _isPaused = true
    }

    if (_isPaused) {
        _isActive = false
        window.cancelAnimationFrame(_raf)
    }
}

export const wake = (...args) => {
    var _currentlyRunning = !_isPaused
    if (args.length > 0) {
        for (var i = 0; i < args.length; i++) {
            var fpsTarget = args[i]
            if (_cadences[fpsTarget]) {
                _cadences[fpsTarget].paused = false
                _isPaused = false
            }
        }
    } else {
        for (var d in _cadences) _cadences[d].paused = false
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
        for (var h in _cadences) {
            _cadences[h].tick()
        }

        window.requestAnimationFrame(handleNext)
    }
}

