import Model from './Model'
import Lesson from './Lesson'

export default class Category extends Model {
  constructor(...attributes) {
    super(...attributes)
    this.nestedObjectsToModels('lessons', Lesson)
  }

  resource() {
    return 'categories'
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
