import Cadence from 'hummingbird/lib/Cadence'
import './request-animation-frame'

let _isPaused = true
let _isActive = true
let _cadences = {}
let _sleepPool = []
let _raf = undefined

export const enlist = singleBird => {
    console.log('singleBird', singleBird, singleBird._fps)
    const fps = singleBird.fps()
    console.log('\t fps:', fps)

    if (!_cadences[fps]) {
        _cadences[fps] = new Cadence(fps)
    }
   
    var pool = _cadences[fps].pool
    // check if it already exists in this category?
    for (var i = 0; i < pool.length; i++) {
        if (pool[i] === singleBird) {
            return singleBird
        }
    }

    pool.push(singleBird)

    if (_isActive) {
        wake('enlist')
    }

    return singleBird
}

export const release = () => {
    // possibly pass in:
    // - instance
    // - id
    // - handler
    // - scope?
    // - fps?
    const isNumber = arguments && !Number.isNaN(arguments[0])
    console.log('arguments:', arguments, isNumber)

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

export const releaseSingle = singleBird => {
    const singleCadencePool = _cadences[singleBird.fps()].pool
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

    if (Object.keys(_cadences).length === 0) {
        sleep()
        _isActive = true
    }
}

export const sleep = (...args) => {
    if (args.length > 0) {
        // loop of cadences by fps
        for (var i = 0; i < args.length; i++) {
            var fpsTarget = args[i]
            if (_cadences[fpsTarget]) {
                _cadences[fpsTarget].paused = true
                _isPaused = true
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
            _cadences[b].paused = true
        }
        _isPaused = true
    }

    if (_isPaused) {
        console.log('CANCEL RAF ---------------')
        _isActive = false
        window.cancelAnimationFrame(_raf)
        console.log('_isActive:', _isActive)
    }
}

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
                if (item.toString() === 'Hummingbird') {
                    item.wake()
                    _isPaused = false  
                } else if (!isNaN(item)) {
                    console.log('~~> else if')
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

        // go through all cadences
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

