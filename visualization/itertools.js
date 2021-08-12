function choice(array) {
  return array[Math.round(Math.random() * (array.length - 1))];
}

function duplicate(sequence) {
  var resultant = [];
  for (var i = 0; i < sequence.length; i++) {
    resultant[i] = sequence[i];
  }
  return resultant;
}

function range(stop, start=0, step=1) {
  var resultant = [];
  while (start + step <= stop) {
    resultant.push(start);
    start += step;
  }
  return resultant
}


function _sample(sequence, n, once=false) {
  if (n > sequence.length && once) {
    throw "The sequence does not contain enough elements for the chosen sample"
  }
  var array = duplicate(sequence);
  var resultant = [];
  for (var i = 0; i < n; i++) {
    var j = choice(range(array.length));
    resultant.push(array[j]);
    if (once) {
      array.splice(j, 1);
    }
  }
  return resultant;
}

function sample(sequence, n, once=false) {
  z = _sample(sequence, n, once);
  while (!(z.every((x) => {return !(x === undefined)}))) {
    z = _sample(sequence, n, once);
  }
  return z;
}

function minimum(array, key=(x) => {return x;}) {
  var iterable = duplicate(array);
  var value = iterable[0];
  for (let e of iterable) {
    value = (key(e) < key(value)) ? e : value;
  }
  return value;
}

function maximum(array, key=(x) => {return x;}) {
  var iterable = duplicate(array);
  var value = iterable[0];
  for (let e of iterable) {
    value = (key(e) > key(value)) ? e : value;
  }
  return value;
}

