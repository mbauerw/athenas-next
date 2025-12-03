import { SEED_QUESTIONS } from "./data/seedQuestions";

function filterQuant() {
  let i = 0
    for (let question of SEED_QUESTIONS){
      if (i < 30 && question.category === 'QUANT') {
        console.log(question);
        i++;
    }
}
}
filterQuant();