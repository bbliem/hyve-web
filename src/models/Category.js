import Model from './Model'
import Lesson from './Lesson'

export default class Category extends Model {
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

  get lessonModels() {
    return this.lessons.map(l => new Lesson(l))
  }
}
