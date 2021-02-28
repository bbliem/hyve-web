import Model from './Model'
import MultipleChoiceQuestion from './MultipleChoiceQuestion'

export default class Quiz extends Model {
  constructor(...attributes) {
    super(...attributes)
    this.nestedObjectsToModels('questions', MultipleChoiceQuestion)
  }

  resource() {
    return 'quizzes'
  }

  get answerIds () {
    return this.questions.map(({ answers }) => answers.map(({ id }) => id)).flat()
  }
}
