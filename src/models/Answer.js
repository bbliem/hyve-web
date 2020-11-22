import Model from './Model'

export default class Answer extends Model {
  resource() {
    return 'answers'
  }

  get text() {
    return this.getLocalizedField('text')
  }

  set text(value) {
    return this.setLocalizedField('text', value)
  }
}
