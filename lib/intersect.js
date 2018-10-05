/**
* Calculates intersection point of two lines
* @param {number} x1 starting point of line 1
* @param {number} y1 starting point of line 1
* @param {number} x2 ending point of line 1
* @param {number} y2 ending point of line 1
* @param {number} x3 starting point of line 2
* @param {number} y3 starting point of line 2
* @param {number} x4 ending point of line 2
* @param {number} y4 ending point of line 2
* @return {Object} x and y co-ordinates of the intersection point
*/

function lineLineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
  // Length 0 check
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // Parallel lines check
  if (denominator === 0) {
    return false;
  }

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // Is Intersection within Segments Check
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }

  // Return a object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1);
  let y = y1 + ua * (y2 - y1);

  // round values
  x = Math.floor(x);
  y = Math.floor(y);

  return { x, y };
}

/**
* Calculates intersection of the line and box
* @param {number} x1 point 1 of line
* @param {number} y1 point 1 of line
* @param {number} x2 point 2 of line
* @param {number} y2 point 2 of line
* @param {number} xb top-left of box
* @param {number} yb top-left of box
* @param {number} wb width of box
* @param {number} hb height of box
* @return {Object} x and y co-ordinates of the intersection point
*/
function lineBoxIntersection(x1, y1, x2, y2, xb, yb, wb, hb) {
  return lineLineIntersection(x1, y1, x2, y2, xb, yb + hb, xb + wb, yb + hb) // bottom
|| lineLineIntersection(x1, y1, x2, y2, xb + wb, yb, xb + wb, yb + hb) // right
|| lineLineIntersection(x1, y1, x2, y2, xb, yb, xb, yb + hb) // left
|| lineLineIntersection(x1, y1, x2, y2, xb, yb, xb + wb, yb); // top
}

/**
* Calculates closest intersection of the line and circle
* @param {number} x1 point 1 of line
* @param {number} y1 point 1 of line
* @param {number} x2 point 2 of line
* @param {number} y2 point 2 of line
* @param {number} h  x position of center of circle
* @param {number} k  y position of the center of the circle
* @param {number} r  radius of the circle
* @return {Object} x and y co-ordinates of the intersection point
*/
function lineCircleIntersection(x1, y1, x2, y2, h, k, r) {
  const A = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  const B = 2 * ((x2 - x1) * (x1 - h) + (y2 - y1) * (y1 - k));
  const C = (x1 - h) * (x1 - h) + (y1 - k) * (y1 - k) - r * r;
  const D = (B * B) - 4 * A * C;
  const sqD = Math.sqrt(D);

  const T = (-B + sqD) / (2 * A); // closest

  if (D > 0) {
    const x = (x2 - x1) * T + x1;
    const y = (y2 - y1) * T + y1;
    return { x, y };
  }
}
