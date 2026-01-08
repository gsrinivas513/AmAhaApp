// DEPRECATED: This file has been replaced by AdminQuizBuilder
// Keeping this as a wrapper for backwards compatibility

import React from 'react';
import AdminQuizBuilder from '../../quizzes/admin/AdminQuizBuilder';

const QuizBuilder = (props) => {
  return <AdminQuizBuilder {...props} />;
};

export default QuizBuilder;
