import Vue from 'vue'
import i18n from '@/i18n'
import { Model as BaseModel } from 'vue-api-query'

export default class Model extends BaseModel {
  baseURL() {
    return Vue.appConfig.backendApiUrl
  }

  parameterNames() {
    return {
      include: 'expand',
      filter: 'filter',
      sort: 'sort',
      fields: 'fields',
      append: 'append',
      page: 'page',
      limit: 'limit'
    }
  }

  // implement a default request method
  request(config) {
    return this.$http.request(config)
  }

  getLocalizedField(field) {
    return this[field + i18n.localeCapitalized]
  }

  nestedObjectsToModels(field, ModelClass) {
    // Turn nested objects having an "id" field into instances of a Model subclass
    if(Array.isArray(this[field])) {
      this[field] = this[field].map(obj => obj.id ? new ModelClass(obj) : obj);
    }
  }

  setLocalizedField(field, value) {
    this[field + i18n.localeCapitalized] = value
  }

  async updateFieldAndSave(field, newValue, unexpandFields=[]) {
    // Update the given field with the given value and save this model. If
    // saving fails, all changes are reverted. `unexpandFields` contains names
    // of fields whose values are assumed to be objects having a key `id`.
    // Before saving, these objects will be replaced by their respective `id`
    // field, and the changes are reverted after saving (no matter whether
    // saving succeeded or not). The purpose of this is to remove
    // included/expanded resources that are nested in this object.
    let unexpandedModel = new this.constructor(this)
    unexpandedModel[field] = newValue
    for(const f of unexpandFields) {
      console.assert(unexpandedModel[f].every(obj => obj.id), `Object in ${this.constructor.name}.${f} lacks ID`)
      unexpandedModel[f] = unexpandedModel[f].map(obj => obj.id)
    }
    await unexpandedModel.save()
    this[field] = newValue
  }
}
