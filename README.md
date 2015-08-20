resin-cli-visuals
-----------------

[![npm version](https://badge.fury.io/js/resin-cli-visuals.svg)](http://badge.fury.io/js/resin-cli-visuals)
[![dependencies](https://david-dm.org/resin-io/resin-cli-visuals.png)](https://david-dm.org/resin-io/resin-cli-visuals.png)
[![Build Status](https://travis-ci.org/resin-io/resin-cli-visuals.svg?branch=master)](https://travis-ci.org/resin-io/resin-cli-visuals)
[![Build status](https://ci.appveyor.com/api/projects/status/dljdbst05bp29wgv?svg=true)](https://ci.appveyor.com/project/jviotti/resin-cli-visuals)

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

<a name="visuals"></a>
## visuals : <code>object</code>
**Kind**: global namespace  

* [visuals](#visuals) : <code>object</code>
  * [.Progress](#visuals.Progress)
    * [new Progress(message)](#new_visuals.Progress_new)
    * [.update(state)](#visuals.Progress+update)
  * [.Spinner](#visuals.Spinner)
    * [new Spinner(message)](#new_visuals.Spinner_new)
    * [.start()](#visuals.Spinner+start)
    * [.stop()](#visuals.Spinner+stop)
  * [.table](#visuals.table) : <code>object</code>
    * [.horizontal(data, ordering)](#visuals.table.horizontal)
    * [.vertical(data, ordering)](#visuals.table.vertical)
  * [.drive([message])](#visuals.drive) ⇒ <code>Promise.&lt;String&gt;</code>

<a name="visuals.Progress"></a>
### visuals.Progress
**Kind**: static class of <code>[visuals](#visuals)</code>  
**Summary**: Create a CLI Progress Bar  
**Access:** public  

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
**Kind**: instance method of <code>[Progress](#visuals.Progress)</code>  
**Summary**: Update the progress bar  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>Object</code> | progress state |
| state.percentage | <code>Number</code> | percentage |
| state.eta | <code>Number</code> | eta in seconds |

**Example**  
```js
progress = new visuals.Progress('Hello World')
progress.update(percentage: 49, eta: 300)
```
<a name="visuals.Spinner"></a>
### visuals.Spinner
**Kind**: static class of <code>[visuals](#visuals)</code>  
**Summary**: Create a CLI Spinner  
**Access:** public  

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
**Kind**: instance method of <code>[Spinner](#visuals.Spinner)</code>  
**Summary**: Start the spinner  
**Access:** public  
**Example**  
```js
spinner = new visuals.Spinner('Hello World')
spinner.start()
```
<a name="visuals.Spinner+stop"></a>
#### spinner.stop()
**Kind**: instance method of <code>[Spinner](#visuals.Spinner)</code>  
**Summary**: Stop the spinner  
**Access:** public  
**Example**  
```js
spinner = new visuals.Spinner('Hello World')
spinner.stop()
```
<a name="visuals.table"></a>
### visuals.table : <code>object</code>
**Kind**: static namespace of <code>[visuals](#visuals)</code>  

* [.table](#visuals.table) : <code>object</code>
  * [.horizontal(data, ordering)](#visuals.table.horizontal)
  * [.vertical(data, ordering)](#visuals.table.vertical)

<a name="visuals.table.horizontal"></a>
#### table.horizontal(data, ordering)
Notice that you can rename columns by using the CURRENT => NEW syntax in the ordering configuration.

**Kind**: static method of <code>[table](#visuals.table)</code>  
**Summary**: Make an horizontal table  
**Access:** public  

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

**Kind**: static method of <code>[table](#visuals.table)</code>  
**Summary**: Make a vertical table  
**Access:** public  

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
Currently, this function only checks the drive list once. In the future, the dropdown will detect and autorefresh itself when the drive list changes.

**Kind**: static method of <code>[visuals](#visuals)</code>  
**Summary**: Prompt the user to select a drive device  
**Returns**: <code>Promise.&lt;String&gt;</code> - device path  
**Access:** public  

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

The project is licensed under the MIT license.
