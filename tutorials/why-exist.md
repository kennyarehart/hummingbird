What is Hummingbird and why does it exist? How does this compare to other packages that have some aspect of time/animation management? This page attempts to answer all of that.

## Origin / Disclaimer

This is a complete re-write and new take on [FrameRate](https://github.com/ff0000-ad-tech/ad-events/blob/master/docs/FrameRate.md), a sub class of another [package](https://github.com/ff0000-ad-tech/ad-events) which I was the original author prior to it being open-sourced. The entire system has been re-imagined and re-written from the ground up with numerous added features.

## Problem

There is no native, universal solution for handling tickers and timers in the browser. This includes the following issues:

-   Mixing multiple <code>requestanimationframe</code>, <code>setTimeout</code>, <code>setInterval</code> calls can degrade performance.
-   There is no native manager when making multiple calls.
-   Pausing, resuming, and controlling the iteration speed are not possible without extensive extra code or library.
-   Greensock's <code>TweenMax.ticker</code> is a single static ticker which can set the fps, however it can only be set to one value.

## Solution

Hummingbird solves all of these and more! By leveraging a single iterator along with intelligently grouping logic, the number of calls are optimized to give the best possible browser performance, even at high volumes of handlers.
