import Model from './Model'
import Answer from './Answer'

export default class Question extends Model {
  constructor(...attributes) {
    super(...attributes)
    this.nestedObjectsToModels('answers', Answer)
  }

  resource() {
    return 'questions'
  }

  get text() {
    return this.getLocalizedField('text')
  }

  set text(value) {
    return this.setLocalizedField('text', value)
  }
}
