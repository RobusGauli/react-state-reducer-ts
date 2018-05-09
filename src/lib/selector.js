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

 export default function reduce(selector) {
  const operationalMapper = {
    set: _set
  };
  
  function _set(value) {
    return value
  }

  let toUpdate = {};
  return new (class {
    set(value) {
      if (typeof value === 'object' && value !== null ){
        let updatedObject = Object.keys(value)
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
            return operationMapper[updater.operation](originalObject);
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