import Model from './Model'

export default class StaticPage extends Model {
  resource() {
    return 'static-pages'
  }

  get content() {
    return this.getLocalizedField('content')
  }

  set content(value) {
    return this.setLocalizedField('content', value)
  }

  get title() {
    return this.getLocalizedField('title')
  }

  set title(value) {
    return this.setLocalizedField('title', value)
  }
}
