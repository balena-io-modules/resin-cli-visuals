visuals = require('../lib/visuals')

bar = new visuals.widgets.Progress('Testing progress bar')

x = 0

tickBar = ->
	x += 10

	bar.update
		percentage: x
		eta: x * 3.14

	return if x >= 100

	setTimeout(tickBar, 200)

tickBar()
