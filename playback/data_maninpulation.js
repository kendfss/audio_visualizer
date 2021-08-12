function ints(string) {
  box = [];
  for (i = 0; i < string.length; i++) {
    box[i] = string.charCodeAt(i);
  }
  return box;
}

function reduce(func, iterable, start=0) {
  for (var e of iterable) {
    start = func(start, e);
  }
  return start;
}

function reduce(iterable, func, start=0) {
  for (var e of iterable) {
    start = func(start, e);
  }
  return start;
}

function addShift(x, y) {
  return (x << 8) + y
}