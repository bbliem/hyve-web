import Model from './Model'
import QuestionResponse from './QuestionResponse'
import SectionCompletion from './SectionCompletion'

export default class User extends Model {
  constructor(...attributes) {
    super(...attributes)
    if(this.questionResponses) {
      // Backend omits user in question responses
      for(let response of this.questionResponses) {
        if(response.user === undefined) {
          response.user = this.id
        }
      }
      this.nestedObjectsToModels('questionResponses', QuestionResponse)
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

  async resetQuestionResponse(answerId) {
    this.resetRelation(this.questionResponses, 'answer', answerId, QuestionResponse)
  }

  async respondToQuestion(answer, response) {
    const existingModel = this.questionResponses.find(model => model.answer == answer.id)
    if(existingModel === undefined) {
      // Create
      const createdModel = await new QuestionResponse({
        user: this.id,
        answer: answer.id,
        response
      }).save()
      console.log(`Created response to question by answering ${answer.id} with ${response}`)
      this.questionResponses.push(createdModel)
    } else {
      // Update
      existingModel.response = response
      await existingModel.save()
      console.log(`Updated response to question by answering ${answer.id} with ${response}`)
    }
  }
}
