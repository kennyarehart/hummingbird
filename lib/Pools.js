import { arrayRemove } from './utils'

function Pools() {
	const T = this
	T.active = []
	T.inactive = []
}

Pools.prototype = {
	add: function(item) {
		this.active.push(item)
	},
	remove: function(item) {
		const T = this
		if (!arrayRemove(T.active, item)) {
			arrayRemove(T.inactive, item)
		}
	},
	disable: function(item) {
		const T = this
		if (arrayRemove(T.active, item)) {
			T.inactive.push(item)
		}
	},
	disableAll: function(callback) {
		const T = this
		for (var i = 0, k = T.active.length; i < k; i++) {
			const item = T.active[i]
			T.inactive.push(item)
			callback(item)
		}
		T.active.length = 0
	},
	enable: function(item) {
		const T = this
		if (arrayRemove(T.inactive, item)) {
			T.active.push(item)
		}
	},
	enableAll: function(callback) {
		const T = this
		for (var i = 0, k = T.inactive.length; i < k; i++) {
			const item = T.inactive[i]
			T.active.push(item)
			callback(item)
		}
		T.inactive.length = 0
	}
}

export default Pools
