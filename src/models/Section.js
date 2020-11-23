import Model from './Model'
import Question from './Question'

export default class Section extends Model {
  constructor(...attributes) {
    super(...attributes)
    this.nestedObjectsToModels('questions', Question)
  }

  resource() {
    return 'sections'
  }

  get text() {
    return this.getLocalizedField('text')
  }

  set text(value) {
    return this.setLocalizedField('text', value)
  }
}
