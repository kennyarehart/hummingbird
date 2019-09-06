import { SECONDS } from './constants'

export const secondsAsFrames = sec => 1 / sec

export const millisecondsPerFrame = fps => Math.floor(1000 / fps)

export const calculateFPS = (val, type) => {
	return type === SECONDS ? secondsAsFrames(val) : val
}

//

export const isHummingBird = src => src.toString() === 'Hummingbird'

export const isNumber = val => !Number.isNaN(val)

export const iterateConditional = (a, b, ...args) => {
	const k = args.length
	for (var i = 0; i < k; i++) {
		const item = args[i]
		if (isHummingBird(item)) {
			a(item)
		} else if (isNumber(item)) {
			b(item)
		} else {
			console.warn(`"${item}" not a valid type/target; expected Number or Hummingbird instance`)
		}
	}
}

export const arrayRemove = (array, item) => {
	for (var i = array.length - 1; i >= 0; i--) {
		if (array[i] === item) {
			return array.splice(i, 1)[0]
		}
	}
	return
}

export const arrayIndexOfByKey = (array, attr, value) => {
	const k = array.length
	for (var i = 0; i < k; i++) {
		if (array[i][attr] === value) {
			return i
		}
	}
	return -1
}

export const arrayFindByKey = (array, attr, value) => {
	const index = arrayIndexOfByKey(array, attr, value)
	return index > -1 ? array[index] : undefined
}

export const arrayRemoveByKey = (array, attr, value) => {
	for (var i = array.length - 1; i >= 0; i--) {
		if (array[i][attr] === value) {
			return array.splice(i, 1)[0]
		}
	}
	return
}

export const arrayInsert = (array, index, item) => {
	array.splice(index, 0, item)
	return array
}
