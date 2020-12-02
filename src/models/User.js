import Model from './Model'
import MultipleChoiceResponse from './MultipleChoiceResponse'
import SectionCompletion from './SectionCompletion'

export default class User extends Model {
  constructor(...attributes) {
    super(...attributes)
    if(this.multipleChoiceResponses) {
      // Backend omits user in multiple-choice responses
      for(let response of this.multipleChoiceResponses) {
        if(response.user === undefined) {
          response.user = this.id
        }
      }
      this.nestedObjectsToModels('multipleChoiceResponses', MultipleChoiceResponse)
    }
  }

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
    return lesson.sections.every(id => this.hasCompletedSection(id))
  }

  async resetRelation(array, key, idToRemove, ModelConstructor) {
    const index = array.findIndex(obj => obj[key] === idToRemove)
    if(index > -1) {
      const existingModel = new ModelConstructor(array[index])
      // If we put the following line after the "await", we might get a race condition.
      array.splice(index, 1)
      await existingModel.delete()
      console.log(`Removed ${ModelConstructor.name}`, JSON.stringify(existingModel))
      // Remove from array
      if(array !== undefined) {
        const index = array.indexOf(idToRemove)
        if(index > -1) {
          array.splice(index, 1)
        }
      }
    }
  }

  async resetSectionCompletion(sectionId) {
    this.resetRelation(this.sectionCompletions, 'section', sectionId, SectionCompletion)
  }

  async resetMultipleChoiceResponse(answerId) {
    this.resetRelation(this.multipleChoiceResponses, 'answer', answerId, MultipleChoiceResponse)
  }

  async respondToMultipleChoiceQuestion(answer, response) {
    const existingModel = this.multipleChoiceResponses.find(model => model.answer == answer.id)
    if(existingModel === undefined) {
      // Create
      const createdModel = await new MultipleChoiceResponse({
        user: this.id,
        answer: answer.id,
        response
      }).save()
      console.log(`Created response to multiple-choice question by answering ${answer.id} with ${response}`)
      this.multipleChoiceResponses.push(createdModel)
    } else {
      // Update
      existingModel.response = response
      await existingModel.save()
      console.log(`Updated response to multiple-choice question by answering ${answer.id} with ${response}`)
    }
  }
}
