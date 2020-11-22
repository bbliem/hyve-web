import Model from './Model'
import Question from './Question'

export default class Section extends Model {
  resource() {
    return 'sections'
  }

  get text() {
    return this.getLocalizedField('text')
  }

  set text(value) {
    return this.setLocalizedField('text', value)
  }

  get questionModels() {
    return this.questions.map(q => new Question(q))
  }
}
