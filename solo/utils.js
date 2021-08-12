function ints(string) {
  box = [];
  for (i = 0; i < string.length; i++) {
    box[i] = string.charCodeAt(i);
  }
  return box;
}

function reduce(iterable, func=(x, y) => {return x+y;}, start=0) {
  for (var e of iterable) {
    start = func(start, e);
  }
  return start;
}

function addShift(x, y) {
  return (x << 8) + y
}

function d2r(degress) {
  return degrees / (180 / Math.PI)
}

function r2d(radians) {
  return radians * (180 / Math.PI)
}

