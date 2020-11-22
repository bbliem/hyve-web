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

  hasCompletedLesson(lesson) {
    const sectionsInLesson = lesson.contents.map(c => c.section)
    return sectionsInLesson.every(id => this.completedSections.includes(id))
  }

  hasCompletedSection(sectionId) {
    return this.completedSections.includes(sectionId)
  }

  resetSectionCompletion(sectionId) {
    if(this.completedSections.includes(sectionId)) {
      // TODO
      console.log("TODO: Reset section completion for", sectionId)
    }
  }
}
