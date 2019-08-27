function Flock(...args) {
    const T = this
    T.pool = []
    T.paused = false

    T.enlist(...args)
}

Flock.prototype = {
    enlist: function(...args) {
        // var args = [].slice.call(arguments);
        this.pool.push(...args)
    },
    release: function(...args) {
        
    },
    sleep: function() {
        const T = this
        T.paused = true
        for (var i = 0, k = T.pool.length; i < k; i++) {
            T.pool[i].sleep()
        }
    },
    wake: function() {
        const T = this
        T.paused = false
        for (var i = 0, k = T.pool.length; i < k; i++) {
            T.pool[i].wake()
        }
    }
}

export default Flock