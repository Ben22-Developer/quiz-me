using Microsoft.OpenApi;
using quiz_me_server.code.dto.question_answer.quiz_marks;
using quiz_me_server.code.dto.question_answer.quiz_model;

namespace quiz_me_server.code.service.question_answer.quiz_mark;

public class QuizSubmitService (QuestionService questionService)
{
    public async Task<QuizMark> PostQuizSubmission (UserQuizAnswer userQuizAnswer)
    {
        Dictionary<long, long> questionIdToAnswerIdMap = userQuizAnswer.QuestionIdToAnswerIdDictionary;
        
        var questionIds = questionIdToAnswerIdMap.Keys.ToHashSet();
        
        var trueQuestionToAnswerDictionary = await questionService.ReadTrueQuestionIdToAnswerId(questionIds);

        QuizMark quizMark = new QuizMark(0, userQuizAnswer.TotalMarks, trueQuestionToAnswerDictionary, DateTime.Now);

        MarkUser(trueQuestionToAnswerDictionary, questionIdToAnswerIdMap, quizMark);

        return quizMark;
    }

    private void MarkUser (Dictionary<long, long>trueQuestionToAnswerDictionary, Dictionary<long, long> questionIdToAnswerIdMap, QuizMark quizMark)
    {
        foreach (var keyValuePair in trueQuestionToAnswerDictionary)
        {
            long userAnswer = questionIdToAnswerIdMap.GetValueOrDefault(keyValuePair.Key, long.MinValue);
            long trueAnswer = keyValuePair.Value;

            if (userAnswer.Equals(trueAnswer))
                quizMark.UserMarks += 1;
        }

        SetMarksAverage(quizMark);
        SetMarksSuggestion(quizMark);
    }

    private void SetMarksAverage (QuizMark quizMark)
    {
        quizMark.Average = ((double)quizMark.UserMarks / (double)quizMark.TotalMarks) * 100;
    }
    
    private void SetMarksSuggestion (QuizMark quizMark)
    {
        if (quizMark.Average > 70)
            quizMark.Suggestion = Suggestion.EXCELLENT.GetDisplayName();
        
        else if (quizMark.Average < 70 && quizMark.Average >= 50)
            quizMark.Suggestion = Suggestion.GOOD.GetDisplayName();

        else
            quizMark.Suggestion = Suggestion.BAD.GetDisplayName();
    }
}