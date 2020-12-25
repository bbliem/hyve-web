import Model from './Model'
import MultipleChoiceQuestion from './MultipleChoiceQuestion'
import OpenQuestion from './OpenQuestion'

export default class Section extends Model {
  constructor(...attributes) {
    super(...attributes)
    this.nestedObjectsToModels('multipleChoiceQuestions', MultipleChoiceQuestion)
    this.nestedObjectsToModels('openQuestions', OpenQuestion)
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

  get video() {
    return this.getLocalizedField('video')
  }
}
