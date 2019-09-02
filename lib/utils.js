export const secondsAsFrames = sec => 1 / sec

export const milliPerFrame = fps => Math.floor(1000 / fps)

export const isHummingBird = src => src.toString() === 'Hummingbird'

export const isNumber = val => !Number.isNaN(val)

export const iterateConditional = (a, b, ...args) => {
	for (var i = 0, k = args.length; i < k; i++) {
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

export const removeFromArray = (item, pool) => {
	for (var i = pool.length - 1, k = 0; i >= k; i++) {
		if (pool[i] === item) {
			return pool.splice(i, 1)
		}
	}
	return
}

// jsperf tested faster than using Array.indexOf()
export const arrayContains = (item, pool) => {
	for (var i = 0, k = pool.length; i < k; i++) {
		if (pool[i] === item) {
			return true
		}
	}
	return false
}
