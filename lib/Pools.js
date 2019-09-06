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
		toggle(item, this.active, this.inactive)
	},
	disableAll: function(callback) {
		toggleAll(callback, this.active, this.inactive)
	},
	enable: function(item) {
		toggle(item, this.inactive, this.active)
	},
	enableAll: function(callback) {
		toggleAll(callback, this.inactive, this.active)
	}
}

function toggle(item, a, b) {
	if (arrayRemove(a, item)) {
		b.push(item)
	}
}

function toggleAll(callback, a, b) {
	for (var i = 0, k = a.length; i < k; i++) {
		const item = a[i]
		b.push(item)
		callback(item)
	}
	a.length = 0
}

export default Pools
