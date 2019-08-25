export const secondsAsFrames = sec => 1 / sec

export const milliPerFrame = fps => Math.floor(1000 / fps)

export const isHummingBird = src => src.toString() === 'Hummingbird'

export const isNumber = val => !Number.isNaN(val)