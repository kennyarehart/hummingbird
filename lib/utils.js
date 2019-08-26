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