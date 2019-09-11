# Hummingbird

[![GitHub issues](https://img.shields.io/github/issues/kennyarehart/hummingbird.svg?style=flat-square)](https://github.com/kennyarehart/hummingbird)
[![GitHub contributors](https://img.shields.io/github/contributors/kennyarehart/hummingbird.svg?style=flat-square)](https://github.com/kennyarehart/hummingbird/graphs/contributors/)
[![GitHub commit-activity](https://img.shields.io/github/commit-activity/y/kennyarehart/hummingbird.svg?style=flat-square)](https://github.com/kennyarehart/hummingbird/commits/master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

---

Hummingbird is a library for working with Javascript's <code>requestanimationframe</code> to centralize a universal ticker for animations, timers, intervals, etc.

### Problem

-   Mixing multiple <code>requestanimationframe</code>, <code>setTimeout</code>, <code>setInterval</code> calls can degrade performance.
-   No centralization when making multiple calls
-   Pausing, resuming, and controlling the iteration speed are not possible without extensive extra code.

### Solution

Hummingbird solves all of these and more! By leveraging a single iterator along with intelligently grouping logic, the number of calls are optimized to give the best possible browser performance, even at high volumes of handlers.

## Features

-   Speed control on a per method basis
-   Pause / Resume on the instance or globally
-   Add <code>lifeSpan</code> to work as a timeout for the instance

## Documentation

-   [General documentation]()
-   API docs
-   [Install guide](./tutorial-install.html)
-   Quick tour
-   Why does Humminbird exist?

## Contribute

Hummingbird is distributed under the MIT license. The code is available on Github. Patches welcome.
