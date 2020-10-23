export const getFunctionResult = (value, context) => {
  const { $result, $scope = [] } = value
  const args = []

  if (typeof $result !== 'string') {
    return $result
  }

  $scope.forEach((key) => {
    args.push({ key, value: context[key] })
  })

  const funcArgs = args
    .sort((a, b) => a.key.charCodeAt() - b.key.charCodeAt())
    .concat(context.functional.map((fx) => ({ key: fx.name, value: fx.fx })))
  // 加上函数引用

  try {
    return new Function(...funcArgs.map((a) => a.key).concat([`return ${$result}`]))(
      ...funcArgs.map((a) => a.value)
    )
  } catch {
    //
  }
}

const deal = (prop, owner, options) => {
  const value = owner[prop].toString()
  const expr = value.slice(value.indexOf(':') + 1, value.length)
  const { context } = options

  Object.defineProperty(owner, prop, {
    get: () =>
      getFunctionResult(
        {
          $result: expr,
          $scope: ['model', 'params', 'datasource', 'refs'],
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

  if (!/^([\$]:)/g.test(value)) {
    return false
  }

  return deal
}
