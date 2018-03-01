resin-cli-visuals
-----------------

[![Current Release](https://img.shields.io/npm/v/resin-cli-visuals.svg?style=flat-square)](https://npmjs.com/package/resin-cli-visuals)
[![License](https://img.shields.io/npm/l/resin-cli-visuals.svg?style=flat-square)](https://npmjs.com/package/resin-cli-visuals)
[![Downloads](https://img.shields.io/npm/dm/resin-cli-visuals.svg?style=flat-square)](https://npmjs.com/package/resin-cli-visuals)
[![Travis CI status](https://img.shields.io/travis/resin-io-modules/resin-cli-visuals/master.svg?style=flat-square)](https://travis-ci.org/resin-io-modules/resin-cli-visuals/branches)
[![AppVeyor status](https://img.shields.io/appveyor/ci/resin-io/resin-cli-visuals/master.svg?style=flat-square)](https://ci.appveyor.com/project/resin-io/resin-cli-visuals/branch/master)
[![Dependencies](https://img.shields.io/david/resin-io-modules/resin-cli-visuals.svg)](https://david-dm.org/resin-io-modules/resin-cli-visuals)

Join our online chat at [![Gitter Chat](https://img.shields.io/gitter/room/resin-io/chat.svg?style=flat-square)](https://gitter.im/resin-io/chat)

Resin CLI UI widgets.

Role
----

The intention of this module is to provide a collection of command line widgets to be used by the Resin CLI and its plugins.

Installation
------------

Install `resin-cli-visuals` by running:

```sh
$ npm install --save resin-cli-visuals
```

Documentation
-------------

## Classes

<dl>
<dt><a href="#DriveScanner">DriveScanner</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#visuals">visuals</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="DriveScanner"></a>

## DriveScanner
**Kind**: global class  
**Summary**: Dynamically detect changes of connected drives  
**Access**: protected  

* [DriveScanner](#DriveScanner)
    * [new DriveScanner(driveFinder, [options])](#new_DriveScanner_new)
    * [.stop()](#DriveScanner+stop)

<a name="new_DriveScanner_new"></a>

### new DriveScanner(driveFinder, [options])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| driveFinder | <code>function</code> |  | drive finder |
| [options] | <code>Object</code> |  | scan options |
| [options.interval] | <code>Number</code> | <code>1000</code> | interval |
| [options.drives] | <code>Array.&lt;Object&gt;</code> |  | current drives |

**Example**  
```js
scanner = new DriveScanner driveFinder,
	interval: 1000
	drives: [
		{ foo: 'bar' }
	]
```
<a name="DriveScanner+stop"></a>

### driveScanner.stop()
**Kind**: instance method of [<code>DriveScanner</code>](#DriveScanner)  
**Summary**: Stop the interval  
**Access**: public  
**Example**  
```js
scanner = new DriveScanner(@driveFinder, interval: 1000)
scanner.stop()
```
<a name="visuals"></a>

## visuals : <code>object</code>
**Kind**: global namespace  

* [visuals](#visuals) : <code>object</code>
    * [.Spinner](#visuals.Spinner)
        * [new Spinner(message)](#new_visuals.Spinner_new)
        * [.start()](#visuals.Spinner+start)
        * [.stop()](#visuals.Spinner+stop)
    * [.Progress](#visuals.Progress)
        * [new Progress(message)](#new_visuals.Progress_new)
        * [.update(state)](#visuals.Progress+update)
    * [.SpinnerPromise](#visuals.SpinnerPromise)
        * [new SpinnerPromise(options)](#new_visuals.SpinnerPromise_new)
    * [.table](#visuals.table) : <code>object</code>
        * [.horizontal(data, ordering)](#visuals.table.horizontal)
        * [.vertical(data, ordering)](#visuals.table.vertical)
    * [.drive([message])](#visuals.drive) ⇒ <code>Promise.&lt;String&gt;</code>

<a name="visuals.Spinner"></a>

### visuals.Spinner
**Kind**: static class of [<code>visuals</code>](#visuals)  
**Summary**: Create a CLI Spinner  
**Access**: public  

* [.Spinner](#visuals.Spinner)
    * [new Spinner(message)](#new_visuals.Spinner_new)
    * [.start()](#visuals.Spinner+start)
    * [.stop()](#visuals.Spinner+stop)

<a name="new_visuals.Spinner_new"></a>

#### new Spinner(message)
**Returns**: <code>Spinner</code> - spinner instance  
**Throws**:

- Will throw if no message.


| Param | Type | Description |
| --- | --- | --- |
| message | <code>String</code> | message |

**Example**  
```js
spinner = new visuals.Spinner('Hello World')
```
<a name="visuals.Spinner+start"></a>

#### spinner.start()
**Kind**: instance method of [<code>Spinner</code>](#visuals.Spinner)  
**Summary**: Start the spinner  
**Access**: public  
**Example**  
```js
spinner = new visuals.Spinner('Hello World')
spinner.start()
```
<a name="visuals.Spinner+stop"></a>

#### spinner.stop()
**Kind**: instance method of [<code>Spinner</code>](#visuals.Spinner)  
**Summary**: Stop the spinner  
**Access**: public  
**Example**  
```js
spinner = new visuals.Spinner('Hello World')
spinner.stop()
```
<a name="visuals.Progress"></a>

### visuals.Progress
**Kind**: static class of [<code>visuals</code>](#visuals)  
**Summary**: Create a CLI Progress Bar  
**Access**: public  

* [.Progress](#visuals.Progress)
    * [new Progress(message)](#new_visuals.Progress_new)
    * [.update(state)](#visuals.Progress+update)

<a name="new_visuals.Progress_new"></a>

#### new Progress(message)
**Returns**: <code>Progress</code> - progress bar instance  
**Throws**:

- Will throw if no message.


| Param | Type | Description |
| --- | --- | --- |
| message | <code>String</code> | message |

**Example**  
```js
progress = new visuals.Progress('Hello World')
```
<a name="visuals.Progress+update"></a>

#### progress.update(state)
**Kind**: instance method of [<code>Progress</code>](#visuals.Progress)  
**Summary**: Update the progress bar  
**Access**: public  
**Parm**: <code>String</code> [state.message] - message  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>Object</code> | progress state |
| state.percentage | <code>Number</code> | percentage |
| [state.eta] | <code>Number</code> | eta in seconds |

**Example**  
```js
progress = new visuals.Progress('Hello World')
progress.update(percentage: 49, eta: 300)
```
<a name="visuals.SpinnerPromise"></a>

### visuals.SpinnerPromise
**Kind**: static class of [<code>visuals</code>](#visuals)  
**Summary**: Create a CLI Spinner that spins on a promise  
**Access**: public  
**Fulfil**: <code>Object</code> value - resolved or rejected promise  
<a name="new_visuals.SpinnerPromise_new"></a>

#### new SpinnerPromise(options)
This function will start a Spinner and stop it when the
passed promise is either fulfilled or rejected. The function
returns the passed promise which will be in either rejected or
resolved state.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | spinner promise options |
| options.promise | <code>Promise</code> | promise to spin upon |
| options.startMessage | <code>String</code> | start spinner message |
| options.stopMessage | <code>String</code> | stop spinner message |

**Example**  
```js
visuals.SpinnerPromise
		 promise: scanDevicesPromise
		 startMessage: "Scanning devices"
		 stopMessage: "Scanned devices"
 .then (devices) ->
		 console.log devices
```
<a name="visuals.table"></a>

### visuals.table : <code>object</code>
**Kind**: static namespace of [<code>visuals</code>](#visuals)  

* [.table](#visuals.table) : <code>object</code>
    * [.horizontal(data, ordering)](#visuals.table.horizontal)
    * [.vertical(data, ordering)](#visuals.table.vertical)

<a name="visuals.table.horizontal"></a>

#### table.horizontal(data, ordering)
Notice that you can rename columns by using the CURRENT => NEW syntax in the ordering configuration.

**Kind**: static method of [<code>table</code>](#visuals.table)  
**Summary**: Make an horizontal table  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array.&lt;Object&gt;</code> | table data |
| ordering | <code>Array.&lt;String&gt;</code> | display ordering |

**Example**  
```js
console.log visuals.table.horizontal [
	{ name: 'John Doe', age: 40 }
	{ name: 'Jane Doe', age: 35 }
], [
	'name => full name'
	'age'
]

FULL NAME AGE
John Doe  40
Jane Doe  35
```
<a name="visuals.table.vertical"></a>

#### table.vertical(data, ordering)
Notice that you can rename columns by using the CURRENT => NEW syntax in the ordering configuration.

Vertical tables also accept separators and subtitles, which are represented in the ordering configuration as empty strings and strings surrounded by dollar signs respectively.

**Kind**: static method of [<code>table</code>](#visuals.table)  
**Summary**: Make a vertical table  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | table data |
| ordering | <code>Array.&lt;String&gt;</code> | display ordering |

**Example**  
```js
console.log visuals.table.vertical
	name: 'John Doe'
	age: 40
	job: 'Developer'
, [
	'$summary$'
	'name => full name'
	'age'
	''
	'$extras$'
	'job'
]

== SUMMARY
FULL NAME: John Doe
AGE:       40

== EXTRAS
JOB:       Developer
```
<a name="visuals.drive"></a>

### visuals.drive([message]) ⇒ <code>Promise.&lt;String&gt;</code>
The dropdown detects and autorefreshes itself when the drive list changes.

**Kind**: static method of [<code>visuals</code>](#visuals)  
**Summary**: Prompt the user to select a drive device  
**Returns**: <code>Promise.&lt;String&gt;</code> - device path  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [message] | <code>String</code> | <code>&#x27;Select a drive&#x27;</code> | message |

**Example**  
```js
visuals.drive('Please select a drive').then (drive) ->
	console.log(drive)
```

Support
-------

If you're having any problem, please [raise an issue](https://github.com/resin-io/resin-cli-visuals/issues/new) on GitHub and the Resin.io team will be happy to help.

Tests
-----

Run the test suite by doing:

```sh
$ gulp test
```

Contribute
----------

- Issue Tracker: [github.com/resin-io/resin-cli-visuals/issues](https://github.com/resin-io/resin-cli-visuals/issues)
- Source Code: [github.com/resin-io/resin-cli-visuals](https://github.com/resin-io/resin-cli-visuals)

Before submitting a PR, please make sure that you include tests, and that [coffeelint](http://www.coffeelint.org/) runs without any warning:

```sh
$ gulp lint
```

License
-------

The project is licensed under the Apache 2.0 license.
