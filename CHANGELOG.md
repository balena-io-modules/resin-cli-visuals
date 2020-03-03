# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## v1.4.2 - 2018-05-07

## 1.4.7 - 2020-03-03

* Remove build output from the repo [Pagan Gazzard]

## 1.4.6 - 2020-02-29

* Remove underscore.string [Pagan Gazzard]
* Update to lodash 4.x [Pagan Gazzard]

## 1.4.5 - 2020-02-28

* Lazy-load inquirer-dynamic-list and drivelist [Pagan Gazzard]

## 1.4.4 - 2019-10-14

* Update drivelist import (fix balena-cli "os initialize") [Paulo Castro]

## 1.4.3 - 2019-05-29

* Dependencies: update to Node 12 compilation [Gergely Imreh]

* refactor(progress.js): setup moment duration format before use [HAKASHUN]

## v1.4.1 - 2018-03-01

* Upgrade(package): Update to drivelist@6.0.4 [Jonas Hermsmeier]
* Allow updater to specify custom message [Theodor Gherzan]
* Test(ci): Fix Node versions used on CI [Jonas Hermsmeier]
* Doc(README): Fix badge links [Jonas Hermsmeier]
* Test(ci): Update Node versions tested against on CI [Jonas Hermsmeier]
* Doc(README): Regenerate README with updated jsdoc2md [Jonas Hermsmeier]
* Chore(build): Update build files [Jonas Hermsmeier]
* Upgrade(package): Bump dependencies [Jonas Hermsmeier]

## [1.4.0] - 2017-06-09

### Changed

- Hide the progress ETA if not specified, rather than assuming it to be 0s

## [1.3.1] - 2017-05-10

### Changed

- Upgrade `drivelist` to v5.0.20.

## [1.3.0] - 2016-10-15

### Added

- Add `SpinnerPromise` class.

## [1.2.9] - 2016-05-03

### Changed

- Upgrade `drivelist` to get recent drive detection improvements.

## [1.2.8] - 2015-12-04

### Changed

- Omit tests from NPM package.

## [1.2.7] - 2015-12-02

### Changed

- Improve no available drives message.

## [1.2.6] - 2015-10-27

### Changed

- Upgrade Inquirer to v0.11.0.

## [1.2.5] - 2015-10-13

### Changed

- Improve "No available drives" message.

## [1.2.4] - 2015-10-06

### Changed

- Prevent submission on drive widget when no available drives.

## [1.2.3] - 2015-10-01

### Changed

- Make drive widget dynamic.

## [1.2.2] - 2015-08-26

### Changed

- Assume `eta` to be zero if it doesn't exist.
- Fix Progress unit test intermittent failures.

## [1.2.1] - 2015-08-24

### Changed

- Fix spinner memory leak when calling `start()` multiple times.

## [1.2.0] - 2015-08-20

### Added

- Support passing a custom message to `drive` widget.

## [1.1.0] - 2015-08-13

### Added

- Add `drive` widget.

[1.4.0]: https://github.com/resin-io/resin-cli-visuals/compare/v1.3.1...v1.4.0
[1.3.1]: https://github.com/resin-io/resin-cli-visuals/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/resin-io/resin-cli-visuals/compare/v1.2.9...v1.3.0
[1.2.9]: https://github.com/resin-io/resin-cli-visuals/compare/v1.2.8...v1.2.9
[1.2.8]: https://github.com/resin-io/resin-cli-visuals/compare/v1.2.7...v1.2.8
[1.2.7]: https://github.com/resin-io/resin-cli-visuals/compare/v1.2.6...v1.2.7
[1.2.6]: https://github.com/resin-io/resin-cli-visuals/compare/v1.2.5...v1.2.6
[1.2.5]: https://github.com/resin-io/resin-cli-visuals/compare/v1.2.4...v1.2.5
[1.2.4]: https://github.com/resin-io/resin-cli-visuals/compare/v1.2.3...v1.2.4
[1.2.3]: https://github.com/resin-io/resin-cli-visuals/compare/v1.2.2...v1.2.3
[1.2.2]: https://github.com/resin-io/resin-cli-visuals/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/resin-io/resin-cli-visuals/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/resin-io/resin-cli-visuals/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/resin-io/resin-cli-visuals/compare/v1.0.0...v1.1.0
