import Model from './Model'
import MultipleChoiceQuestion from './MultipleChoiceQuestion'

export default class Section extends Model {
  constructor(...attributes) {
    super(...attributes)
    this.nestedObjectsToModels('multipleChoiceQuestions', MultipleChoiceQuestion)
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
