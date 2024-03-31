/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

/* Throttle function to limit the number of times a function can be called in a given time frame */

export default function Throttle(this: any, fn: Function, delay: number = 1000) {
  let throttled: boolean = false;
  const thisArg = this;

  const throttledFunction = function (...args: any[]) {
    if (!throttled) {
      const result = fn.apply(thisArg, args);
      throttled = true;

      setTimeout(() => {
        throttled = false;
      }, delay);

      return result;
    }
  };

  return throttledFunction.bind(this);
}
