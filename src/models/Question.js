import Model from './Model'
import Answer from './Answer'

export default class Question extends Model {
  resource() {
    return 'questions'
  }

  get text() {
    return this.getLocalizedField('text')
  }

  set text(value) {
    return this.setLocalizedField('text', value)
  }

  get answerModels() {
    return this.answers.map(a => new Answer(a))
  }
}
