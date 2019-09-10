import { arrayRemove } from './utils'

function Flock(...args) {
	const T = this

	if (!(T instanceof Flock)) {
		return new Flock(...args)
	}

	T.pool = []
	T.add(...args)
}

Flock.prototype = {
	add: function(...args) {
		this.pool.push(...args)
	},
	remove: function(...args) {
		const T = this
		for (var i = 0, k = args.length; i < k; i++) {
			arrayRemove(T.pool, args[i])
		}
	},
	sleep: function() {
		const T = this
		T.paused = true
		T._loop('sleep')
	},
	wake: function() {
		const T = this
		T.paused = false
		T._loop('wake')
	},
	toString: () => 'Flock',
	_loop: function(method) {
		const T = this
		for (var i = T.pool.length - 1; i >= 0; i--) {
			T.pool[i][method]()
		}
	}
}

export default Flock
