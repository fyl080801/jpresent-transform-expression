import { getFunctionResult } from './expression'

const deal = (prop, owner, options) => {
  const value = owner[prop].toString()
  const expr = value.slice(value.indexOf(':') + 1, value.length)
  const { context } = options

  Object.defineProperty(owner, prop, {
    get: () =>
      getFunctionResult(
        {
          $result: '`' + expr + '`',
          $scope: ['model', 'params', 'datasource', 'refs', 'scope'],
        },
        context
      ),
  })
}

export default (prop, owner) => {
  const value = owner[prop]

  if (typeof value !== 'string') {
    return false
  }

  if (!/^([#]:)/g.test(value)) {
    return false
  }

  return deal
}
