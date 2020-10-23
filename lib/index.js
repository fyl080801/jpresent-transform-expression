import expression from './transforms/expression'
import template from './transforms/template'
import on from './transforms/on'

export default ({ transform }) => {
  transform(expression)
  transform(template)
  transform(on)
}
