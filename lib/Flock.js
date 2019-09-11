import { arrayRemove } from './utils'

/**
 * A Flock is a way of grouping Hummingbird or even other Flock instances for a singlular way
 * to <code>sleep</code> & <code>wake</code> every instance added to the <code>Flock</code>.
 * When creating an instance simply pass in any number of instances or use the <code>add</code>
 * or <code>remove</code> after.
 * @class
 * @category API
 * @constructor
 *
 * @param {...Hummingbird|Flock} args - instances to be added on instantiation
 * @example
 * import { Flock, Hummingbird } from 'hummingbird'
 *
 * function foo() { ... }
 * function bar() { ... }
 * function qux() { ... }
 *
 * const fooBird = Hummingbird(foo)
 * const barBird = Hummingbird(bar)
 * const quxBird = Hummingbird(qux)
 *
 * // create a Flock (new keywork is optional)
 * const myFirstFlock = new Flock(fooBird, barBird)
 *
 * // create another Flock and pass in a Flock instance & Hummingbird instance
 * const mySecondFlock = Flock(myFirstFlock, quxBird)
 */
function Flock(...args) {
	const T = this

	if (!(T instanceof Flock)) {
		return new Flock(...args)
	}

	T.pool = []
	T.add(...args)
}

Flock.prototype = {
	/**
	 * Add an instance to the pool that can be controlled by the <code>Flock</code> methods
	 * @param {...Hummingbird|Flock} args - instances to be added
	 * @example
	 * myFirstFlock.add(quxBird)
	 * myFirstFlock.add(function() {
	 *  ...
	 * })
	 * myFirstFlock.add(() => {
	 *  ...
	 * })
	 */
	add: function(...args) {
		this.pool.push(...args)
	},
	/**
	 * remove an instance to the pool
	 * @param {...Hummingbird|Flock} args - instances to be added
	 * @example
	 * myFirstFlock.remove(fooBird)
	 */
	remove: function(...args) {
		const T = this
		for (var i = 0, k = args.length; i < k; i++) {
			arrayRemove(T.pool, args[i])
		}
	},
	/**
	 * Will <code>sleep</code> every instance in the <code>Flock</code>
	 * @example
	 * myFirstFlock.sleep()
	 */
	sleep: function() {
		this._loop('sleep')
	},
	/**
	 * Will <code>wake</code> every instance in the <code>Flock</code>
	 * @example
	 * myFirstFlock.wake()
	 */
	wake: function() {
		this._loop('wake')
	},
	/**
	 * The name of the function as as String: 'Flock'
	 */
	toString: () => 'Flock',
	_loop: function(method) {
		const T = this
		for (var i = T.pool.length - 1; i >= 0; i--) {
			T.pool[i][method]()
		}
	}
}

export default Flock
