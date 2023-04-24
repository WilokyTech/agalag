import { Vector2 } from "./vector.js";

/**
 * Linear interlopation between two numbers.
 * 
 * @param {number | Vector2} start
 * @param {number | Vector2} end 
 * @param {number} t A value between 0 and 1 to control the interpolation.
 * @returns {number | Vector2}
 */
export function lerp(start, end, t) {
  if (typeof start === 'number' && typeof end === 'number') {
    return start * (1 - t) + end * t;
  } else if (start instanceof Vector2 && end instanceof Vector2) {
    const delta = end.subtract(start);
    const lerpVector = start.add(delta.multiply(t));
    return lerpVector;
  } else {
    throw new TypeError('lerp() only supports numbers and Vector2s and the types of start and end must match.');
  }
}
