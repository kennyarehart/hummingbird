function SingleBird(handler, args) {
    const T = this
    T.handler = handler

    args = args || {}
    T.fps = args.fps || null
    T.scope = args.scope || null

    T.isPaused = false
    T.id = 'bird-' + Math.round(Date.now() * Math.random())
}

SingleBird.prototype = {
    setFps: function(val) {
        this.fps = val
        // change its Category somehow here
        return this
    },
    sleep: function() {
        this.isPaused = true
        return this
    },
    wake: function() {
        this.isPaused = false
        return this
    }
}

export default SingleBird