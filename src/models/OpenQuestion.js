import Model from './Model'

export default class OpenQuestion extends Model {
  resource() {
    return 'open-questions'
  }

  get text() {
    return this.getLocalizedField('text')
  }

  set text(value) {
    return this.setLocalizedField('text', value)
  }
}
