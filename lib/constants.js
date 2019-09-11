/**
 * Used to define iteration / time value calculated as frames(flaps) per second
 * @constant
 * @category API
 * @type {string}
 * @example
 * import { FLAPS, Hummingbird } from 'hummingbird'
 *
 * Hummingbird(function() { ... }, {
 *  lifeSpan: 6
 *  lifeSpanIn: FLAPS
 * })
 */
export const FLAPS = 'useFps'

/**
 * Used to define iteration / time value calculated in seconds
 * @constant
 * @category API
 * @type {string}
 * @example
 * import { SECONDS, Hummingbird } from 'hummingbird'
 *
 * Hummingbird(function() { ... }, {
 *  speed: 1.3
 *  speedIn: SECONDS
 * })
 */
export const SECONDS = 'useSeconds'
