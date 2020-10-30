import Model from './Model'
import SectionCompletion from './SectionCompletion'

export default class User extends Model {
  // We don't access to the User resource at the moment; just getting the user on login as response to our POST request
  //resource() {
  //  return 'users'
  //}
  completeSection(sectionId) {
    if(!this.completedSections.includes(sectionId)) {
      new SectionCompletion({user: this.id, section: sectionId})
        .save()
        .then(() => {
          console.log("completed section", sectionId)
          this.completedSections.push(sectionId)
        })
    }
  }
}
