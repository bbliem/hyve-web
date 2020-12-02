import Model from './Model'
import MultipleChoiceAnswer from './MultipleChoiceAnswer'

export default class MultipleChoiceQuestion extends Model {
  constructor(...attributes) {
    super(...attributes)
    this.nestedObjectsToModels('answers', MultipleChoiceAnswer)
  }

  resource() {
    return 'multiple-choice-questions'
  }

  get text() {
    return this.getLocalizedField('text')
  }

  set text(value) {
    return this.setLocalizedField('text', value)
  }
}
