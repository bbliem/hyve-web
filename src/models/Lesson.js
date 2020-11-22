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

  get name() {
    return this.getLocalizedField('name')
  }

  set name(value) {
    return this.setLocalizedField('name', value)
  }
}
