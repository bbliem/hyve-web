import Model from './Model'

export default class StaticPage extends Model {
  resource() {
    return 'static-pages'
  }

  get body() {
    return this.getLocalizedField('body')
  }

  set body(value) {
    return this.setLocalizedField('body', value)
  }

  get title() {
    return this.getLocalizedField('title')
  }

  set title(value) {
    return this.setLocalizedField('title', value)
  }
}
