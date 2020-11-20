import Model from './Model'
import SectionCompletion from './SectionCompletion'

export default class User extends Model {
  resource() {
    return 'users'
  }

  completeSection(sectionId) {
    if(!this.completedSections.includes(sectionId)) {
      new SectionCompletion({user: this.id, section: sectionId})
        .save()
        .then(() => {
          console.log("Completed section", sectionId)
          this.completedSections.push(sectionId)
        })
    }
  }
}
