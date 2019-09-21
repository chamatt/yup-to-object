const clone = require("lodash/clone");
const toPath = require("lodash/toPath");
/* eslint-disable no-param-reassign */

const isInteger = obj => String(Math.floor(Number(obj))) === obj;

function getIn(obj, key, def, p = 0) {
  const path = toPath(key);
  while (obj && p < path.length) {
    // eslint-disable-next-line no-plusplus
    obj = obj[path[p++]];
  }
  return obj === undefined ? def : obj;
}

function setIn(obj, path, value) {
  const res = clone(obj); // this keeps inheritance when obj is a class
  let resVal = res;
  let i = 0;
  const pathArray = toPath(path);
  // eslint-disable-next-line no-plusplus
  for (; i < pathArray.length - 1; i++) {
    const currentPath = pathArray[i];
    const currentObj = getIn(obj, pathArray.slice(0, i + 1));
    if (currentObj) {
      // eslint-disable-next-line no-multi-assign
      resVal = resVal[currentPath] = clone(currentObj);
    } else {
      const nextPath = pathArray[i + 1];
      // eslint-disable-next-line no-multi-assign
      resVal = resVal[currentPath] =
        isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {};
    }
  }
  // Return original object if new value is the same as current
  if ((i === 0 ? obj : resVal)[pathArray[i]] === value) {
    return obj;
  }
  if (value === undefined) {
    delete resVal[pathArray[i]];
  } else {
    resVal[pathArray[i]] = value;
  }
  // If the path array has a single element, the loop did not run.
  // Deleting on `resVal` had no effect in this scenario, so we delete on the result instead.
  if (i === 0 && value === undefined) {
    delete res[pathArray[i]];
  }
  return res;
}

/**
 * Turns yup errors to a more readable, workable, and useful format
 *
 * @param {} yupError The error that is returned from a yup validation
 */
function getErrors(yupError) {
  let errors = {};
  if (yupError.inner.length === 0) {
    return setIn(errors, yupError.path, yupError.message);
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const err of yupError.inner) {
    if (!errors[err.path]) {
      errors = setIn(errors, err.path, err.message);
    }
  }
  return errors;
}

module.exports = getErrors;
