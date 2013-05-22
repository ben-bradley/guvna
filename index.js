var events = require('events');

function Guvna(options, callback, done) {
	
	// error checking
	if (!options.list || !options.callback || !options.done) { return false; }
	
	var guvna = this;
	
	// assign vars
	guvna.list = options.list;
	guvna.callback = options.callback;
	guvna.done = options.done;
	
	// assign counters
	guvna.max = (options.max || Math.floor((options.list.length-1)/3));
	guvna.started = 0;
	guvna.completed = 0;
	
	// map the list
	guvna.list.forEach(function(l) {
		l = { options: l };
		l.prototype = new events.EventEmitter;
	});
	
	// set listeners
	guvna.on('complete', function() {
		if (guvna.list[++guvna.completed]) { guvna.next(); }
		else if (guvna.completed == guvna.list.length) { guvna.done(); }
	});
}

Guvna.prototype = {
	next: function() {
		if (this.list[this.started]) {
			this.callback(this.list[this.started]);
			this.started++;
		}
	},
	start: function() { for(var i = 0; i < this.max; i++) { this.next(); } }
};

Guvna.prototype.__proto__ = events.EventEmitter.prototype;

//var	response = [];
//var guv = new Guvna({
//	max: 10,
//	list: [ { name: 'blargh' }, { name: 'honk' }, { name: 'toot' } ],
//	callback: function(l) {
//		var rand = Math.floor((Math.random()*10)+1) * 1000,
//				self = this;
//		setTimeout(function() {
//			response.push(l.name+'-'+rand);
//			self.emit('complete'); // THIS IS CRITICAL
//		}, rand);
//	},
//	done: function() { console.log(response); }
//});
//
//guv.start();


module.exports = Guvna;