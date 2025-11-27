import React, { useState, useEffect } from 'react';
import { SEED_QUESTIONS } from '@/data/seedQuestions';
import { Question } from '@/types';

export const QuantQuiz = () => {

  const [questions, setQuestions] = useState<string[]>();

  const filterQuant= () => {
    for (let question in SEED_QUESTIONS){
      // const tempQuestion = question.topic;
      console.log(question);
    }
  }

  useEffect(()=>{
    filterQuant();
  },[])

  return (
    <div>


    </div>
  )
}