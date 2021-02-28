import Model from './Model'
import MultipleChoiceResponse from './MultipleChoiceResponse'
import OpenQuestionResponse from './OpenQuestionResponse'
import BlockCompletion from './BlockCompletion'

export default class User extends Model {
  constructor(...attributes) {
    super(...attributes)
    if(this.multipleChoiceResponses && this.openQuestionResponses) {
      // Backend omits user in responses to multiple-choice and open questions
      for(let response of this.multipleChoiceResponses) {
        if(response.user === undefined) {
          response.user = this.id
        }
      }
      for(let response of this.openQuestionResponses) {
        if(response.user === undefined) {
          response.user = this.id
        }
      }
      this.nestedObjectsToModels('multipleChoiceResponses', MultipleChoiceResponse)
      this.nestedObjectsToModels('openQuestionResponses', OpenQuestionResponse)
    }
  }

  resource() {
    return 'users'
  }

  completeBlock(blockId, lessonId) {
    if(!this.hasCompletedBlock(blockId)) {
      new BlockCompletion({user: this.id, lesson: lessonId, block: blockId})
        .save()
        .then((completion) => {
          console.log("Completed block", blockId)
          if(this.blockCompletions !== undefined) {
            this.blockCompletions.push(completion)
          }
        })
    }
  }

  hasCompletedBlock(blockId) {
    return this.blockCompletions.some(({ block }) => block === blockId)
  }

  hasCompletedLesson(lesson) {
    return lesson.blockIds.every(id => this.hasCompletedBlock(id))
  }

  hasRespondedToOpenQuestion(openQuestionId) {
    return this.openQuestionResponses.some(({ question }) => question == openQuestionId)
  }

  hasRespondedToQuiz(quizId) {
    return this.multipleChoiceResponses.some(({ quiz }) => quiz == quizId)
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

  async resetBlockCompletion(blockId) {
    this.resetRelation(this.blockCompletions, 'block', blockId, BlockCompletion)
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

  async respondToOpenQuestion(question, response) {
    const existingModel = this.openQuestionResponses.find(model => model.question == question.id)
    if(existingModel === undefined) {
      // Create
      const createdModel = await new OpenQuestionResponse({
        user: this.id,
        question: question.id,
        response
      }).save()
      console.log(`Created response to open question ${question.id}`)
      this.openQuestionResponses.push(createdModel)
    } else {
      // Update
      existingModel.response = response
      await existingModel.save()
      console.log(`Updated response to open question ${question.id}`)
    }
  }
}
