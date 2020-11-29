import Model from './Model'
import Lesson from './Lesson'

export default class Organization extends Model {
  constructor(...attributes) {
    super(...attributes)
    this.nestedObjectsToModels('lessons', Lesson)
  }

  resource() {
    return 'organizations'
  }
}
