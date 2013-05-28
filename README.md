Guvna
=====

Guvna allows for easily managing the number of times a function is run concurrently.

I ran into a problem where I neede to execute a resource intensive function iteratively and quickly killed the box.

To address the problem, I wrote the Guvna to govern the volume and execution of this function.

Version 0.0.3
-------------
Guvna now uses integer variables to track concurrency information instead of events.  I found that when I nested one guvna in another, the variable scope was lost when events were used to trigger and track concurrency.
In v0.0.3 I just tweaked the `.max` calculation so that if the specified `.max` is less than the `.list.length`, it will default to `.list.length`.

To use this version of Guvna, you'll need to call a `this.next()` when your callback function is complete to trigger the next one.  More in the examples below.

Usage
-----

Since Guvna now uses integer variables to signal when your callback has completed a run, you MUST include `this.next();` in your function, though if you're running an asynch function, you'll likely have to create a reference to `this` as seen in the example below that gets tucked into the asynch function.  In the code below, I call create `self` so that I can get to the `.next()` function.

In this example, I use `setTimeout` to simulate an asynch call.

```javascript
var	response = [],
		Guvna = require('guvna');

var guv = new Guvna({
	max: 2,
	list: [ { name: 'blargh' }, { name: 'honk' }, { name: 'toot' } ],
	callback: function(l) {
		var rand = Math.floor((Math.random()*10)+1) * 1000,
				self = this;
		setTimeout(function() {
			response.push(l.name+'-'+rand);
			self.next(); // CHANGE FROM v0.0.1
		}, rand);
	},
	done: function() { console.log(response); }
});

guv.start();
```

Options
-------
When declaring your `guv` variable, you need to pass it several options:
* `list`: This is a simple array.  Each item in the array is passed to the `callback` function one at a time.
* `callback`: This is the function that you want to govern.  It is passed each item from the `list`.
* `done`: This is the function to run when all your `callback`s are complete.
* `max`: (optional) This is an integer for how many concurrent `callback`s you want to have running.  Default = `list.length`


Versions
--------

0.0.2 - Refactored to use tracking variables as using events created unnecessary comnplexity especially when nesting guvnas.
0.0.1 - Initial drop, used events to manage concurrency.
