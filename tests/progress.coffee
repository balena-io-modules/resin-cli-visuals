visuals = require('../lib/visuals')

bar = new visuals.widgets.Progress('My bar')

x = 0

printBar = ->
	if x >= 100
		console.log bar.lines
		return bar.end()

	x += 10
	bar.update(x, 100 / x)
	setTimeout(printBar, 200)

printBar()
