import Model from './Model'

export default class Lesson extends Model {
  resource() {
    return 'lessons'
  }

  get description() {
    return this.getLocalizedField('description')
  }

  set description(value) {
    return this.setLocalizedField('description', value)
  }

  get title() {
    return this.getLocalizedField('title')
  }

  set title(value) {
    return this.setLocalizedField('title', value)
  }

  get body() {
    return this.getLocalizedField('body')
  }

  set body(value) {
    return this.setLocalizedField('body', value)
  }

  get blockIds() {
    return this.getLocalizedField('blockIds')
  }

  set blockIds(value) {
    return this.setLocalizedField('blockIds', value)
  }

  get blocks() {
    // return this.body === undefined ? undefined : JSON.parse(this.body)
    return this.getLocalizedField('body')
  }
}
