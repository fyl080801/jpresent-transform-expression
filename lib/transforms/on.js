import { getFunctionResult } from './expression'
import { cloneDeep, isArray } from 'lodash-es'

export const getOnFunction = (value, options) => {
  return (...args) => {
    const { $key } = value
    const { context, emitter } = options
    const result = getFunctionResult(value, { ...context, arguments: [...args] })
    const modelPath = $key.trim()

    if (
      context.model !== undefined &&
      context.model !== null &&
      (typeof context.model === 'object' || isArray(context.model)) &&
      modelPath.length > 0
    ) {
      emitter.emit('update', {
        path: modelPath,
        value: typeof result === 'object' ? cloneDeep(result) : result,
      })
    } else {
      return result
    }
  }
}

const deal = (prop, owner, options) => {
  const value = owner[prop].toString()
  const expr = value.slice(value.indexOf(':') + 1, value.length)
  const expKey = value.slice(1, value.indexOf(':'))

  Object.defineProperty(owner, prop, {
    get: () =>
      getOnFunction(
        {
          $result: expr,
          $scope: ['model', 'params', 'datasource', 'refs', 'arguments'],
          $key: expKey,
        },
        options
      ),
  })

  return false
}

export default (prop, owner) => {
  const value = owner[prop]

  if (typeof value !== 'string') {
    return false
  }

  if (!/^(@[\s\S]*:)/g.test(value)) {
    return false
  }

  return deal
}
