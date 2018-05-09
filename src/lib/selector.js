/**
 * Accepts the selector object and operation intended
 *
 * ### Example (es module)
 * ```js
 * import reduce from 'react-state-reducer';
 * const deepObject = {
 *  person: {
 *    name: 'robus gauli',
 *    address: {
 *      permanent: 'Nepal',
 *      temporary: 'China'
 *    }
 *  }
 * }
 * 
 * const selector = {
 *  person: {
 *    address: {
 *      permanent: '#'  
 *    }
 *  }
 * }
 * 
 * const reducer = reduce(selector)
 * const result = reducer
 *                  .set('Holy land')
 *                  .apply(deepObject)
 * // => {
 *    person: {
 *      name: ...,
 *      address: {
 *        permanent: 'Holy land',
 *        temporary: 'China'
 *      }
 *    }
 *  }
 * ```
 */

function reduce(selector) {
  const operationalMapper = {
    set: set,
    append: append
  };
  
  function set(oldValue, newValue) {
    return newValue;
  }

  function append(oldList, value) {
    // if value is null or undefined return the same original list
    if (
      value === undefined ||
      value === null ||
      !Array.isArray(oldList)
    ) {
      return oldList;
    }
    return oldList.concat(value);
  }

  let toUpdate = {};
  return new (class {
    set(value) {
      if (typeof value === 'object' && value !== null ){
        const updatedObject = Object.keys(value)
          .reduce((acc, key) => {
            return {...acc, [key]: {
              operation: 'set',
              value: value[key]
            }}
          }, {});
        toUpdate = {
          ...toUpdate,
          ...updatedObject
        }
      } else if (typeof value === 'string') {
        toUpdate = {
          toUpdate,
          default: {
            operation: 'set',
            value: value
          }
        }
      }
      return this;
    }

    append(value) {
      if(
        typeof value === 'object' &&
        value !== null
      ) {
        const updatedObject =  Object.keys(value)
          .reduce((acc, key) => {
            return {...acc, [key]: {
              operation: 'append',
              value: value[key]
            }}
          }, {});
        
        toUpdate = {
          ...toUpdate,
          ...updatedObject
        }
      } else {
        toUpdate = {
          ...toUpdate,
          default: {
            operation: 'append',
            value: value,
          }
        }
      }
      return this;
    }

    _apply(originalObject, selector) {
      if (
        typeof selector === 'string' &&
        selector.includes('#')
      ) {
        // we reached to the target
        if (!Object.keys(toUpdate).length) {
          throw new Error('Should at least has a one operation intended before applying changes');
        }

        if (selector === '#') {
          if (Object.keys(toUpdate).indexOf('default') !== -1) {
            const updater = toUpdate.default;
            console.log(updater);
            return operationalMapper[updater.operation](originalObject, updater.value);
          }
          return originalObject;
        }
      }

      const clonedObject = Object.assign({}, originalObject);

      Object.keys(selector)
        .forEach(key => {
          const keyedObject = clonedObject[key];
          const filteredObject = selector[key];
          clonedObject[key] = this._apply(
            keyedObject,
            filteredObject
          );
        })
      return clonedObject;
    }

    apply(originalObject) {
      return this._apply(originalObject, selector);
    }

   })();
 }

 module.exports = reduce;
