function Guvna(options) {
	
	// error checking
	if (!options.list || !options.callback || !options.done) {
		console.log('ERROR: missing required option - { list: [], callback: fn(), done: fn() }');
		return false;
	}
	
	// assign vars
	this.list = options.list;
	this.callback = options.callback;
	this.done = options.done;
	
	// assign counters
	this.max = (options.max && options.max < options.list.length) ? options.max : options.list.length;
	this.started = 0;
	this.completed = 0;
	
}

Guvna.prototype = {
	
	start: function() { while (this.started < this.max) { this.callback(this.list[this.started++]); } },
	
	next: function() {
		this.completed += 1;
		if (this.list[this.started]) { this.callback(this.list[this.started++]); }
		else if (this.completed == this.list.length) { this.done(); }
	}
	
};

module.exports = Guvna;