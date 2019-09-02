const pre = ['webkit', 'moz']
for (var i = 0; !window.requestAnimationFrame && i < pre.length; i++) {
	const p = pre[i]
	window.requestAnimationFrame = window[p + 'RequestAnimationFrame']
	window.cancelAnimationFrame = window[p + 'CancelAnimationFrame'] || window[p + 'CancelRequestAnimationFrame']
}

if (!window.requestAnimationFrame || !window.cancelAnimationFrame) {
	window.requestAnimationFrame = function(callback) {
		return setTimeout(callback, 17)
	}
	window.cancelAnimationFrame = clearTimeout
}
