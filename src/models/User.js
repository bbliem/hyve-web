import Model from './Model'
import SectionCompletion from './SectionCompletion'

export default class User extends Model {
  resource() {
    return 'users'
  }

  completeSection(sectionId) {
    if(!this.hasCompletedSection(sectionId)) {
      new SectionCompletion({user: this.id, section: sectionId})
        .save()
        .then((completion) => {
          console.log("Completed section", sectionId)
          if(this.completedSections !== undefined) {
            this.completedSections.push(sectionId)
          }
          if(this.sectionCompletions !== undefined) {
            this.sectionCompletions.push(completion)
          }
        })
    }
  }

  hasCompletedSection(sectionId) {
    if(this.completedSections !== undefined) {
      return this.completedSections.includes(sectionId)
    }
    return this.sectionCompletions.some(({ section }) => section === sectionId)
  }

  hasCompletedLesson(lesson) {
    const sectionsInLesson = lesson.sections.map(c => c.section)
    return sectionsInLesson.every(id => this.hasCompletedSection(id))
  }

  async resetSectionCompletion(sectionId) {
    const index = this.sectionCompletions.findIndex(({ section }) => section === sectionId)
    if(index > -1) {
      const completion = new SectionCompletion(this.sectionCompletions[index])
      // If we put the following line after the "await", we might get a race condition.
      this.sectionCompletions.splice(index, 1)
      await completion.delete()
      console.log("Removed section completion", JSON.stringify(completion))
      // Remove from completedSections
      if(this.completedSections !== undefined) {
        const index = this.completedSections.indexOf(sectionId)
        if(index > -1) {
          this.completedSections.splice(index, 1)
        }
      }
    }
  }
}
