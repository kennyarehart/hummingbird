// there is a bug in iOS6 for RAF, so just detect being on it and fall back
const _isiOS6 = /iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent)

const _prefix = ['webkit', 'moz']
for (let i = 0; !window.requestAnimationFrame && i < _prefix.length; i++) {
	window.requestAnimationFrame = window[_prefix[i] + 'RequestAnimationFrame']
	window.cancelAnimationFrame = window[_prefix[i] + 'CancelAnimationFrame'] || window[_prefix[i] + 'CancelRequestAnimationFrame']
}

if (!window.requestAnimationFrame || !window.cancelAnimationFrame || _isiOS6) {
	console.log('PolyFill -> FrameRate')
	window.requestAnimationFrame = function(callback) {
		return setTimeout(callback, 17)
	}
	window.cancelAnimationFrame = clearTimeout
}