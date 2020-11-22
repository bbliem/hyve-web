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

  setLocalizedField(field, value) {
    this[field + i18n.localeCapitalized] = value
  }
}
