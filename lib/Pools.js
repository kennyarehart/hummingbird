import { removeFromArray } from './utils'

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
		if (!removeFromArray(item, T.active)) {
			removeFromArray(item, T.inactive)
		}
	},
	disable: function(item) {
		const T = this
		if (removeFromArray(item, T.active)) {
			T.inactive.push(item)
		}
	},
	enable: function(item) {
		const T = this
		if (removeFromArray(item, T.inactive)) {
			T.active.push(item)
		}
	},
	enableAll: function(callback) {
		const T = this
		if (T.inactive.length > 0) {
			for (var i = 0, k = T.inactive.length; i < k; i++) {
				const item = T.inactive[i]
				T.active.push(item)
				callback(item)
			}
			T.inactive.length = 0
		}
	}
}

export default Pools
