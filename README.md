Guvna
=====

Guvna allows for easily managing the number of times a function is run concurrently.

I ran into a problem where I neede to execute a resource intensive function iteratively and quickly killed the box.

To address the problem, I wrote the Guvna to govern the volume and execution of this function.

Usage
-----
Guvna uses events to signal when your function has completed a run so you MUST include `this.emit('complete');` in your function, though if you're running an asynch function, you'll likely have to create a reference to `this` as seen in the example below.

In this example, I use `setTimeout` to simulate an asynch call.  Also, you can see that I emit an arbitrary `blargh` event so you can build custom event emitters/listeners into your function.

```javascript
var Guvna = require('guvna'),
		response = [];

var guv = new Guvna({
	max: 2,
	list: [ { name: 'blargh' }, { name: 'honk' }, { name: 'toot' } ],
	callback: function(l) {
		var rand = Math.floor((Math.random()*10)+1) * 1000,
				self = this;
		setTimeout(function() {
			response.push(l.name+'-'+rand);
			/*******IMPORTANT*******/
			self.emit('complete');
			/*******/IMPORTANT*******/
			self.emit('blargh');
		}, rand);
	},
	done: function() { console.log(response); }
});

guv.start();

// your function will also be able to emit events
guv.on('blargh', function() { console.log('honk'); });
```

Options
-------
When declaring your `guv` variable, you need to pass it several options:
* `list`: This is a simple array.  Each item in the array is passed to the `callback` function one at a time.
* `callback`: This is the function that you want to govern.  It is passed each item from the `list`.
* `done`: This is the function to run when all your `callback`s are complete.
* `max`: (optional) This is an integer for how many concurrent `callback`s you want to have running.  Default = `list.length / 3`