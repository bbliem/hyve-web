import Model from './Model'

export default class Answer extends Model {
  resource() {
    return 'answers'
  }

  get explanation() {
    return this.getLocalizedField('explanation')
  }

  set explanation(value) {
    return this.setLocalizedField('explanation', value)
  }

  get text() {
    return this.getLocalizedField('text')
  }

  set text(value) {
    return this.setLocalizedField('text', value)
  }
}
