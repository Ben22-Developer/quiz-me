using System.Diagnostics.CodeAnalysis;
using quiz_me_server.code.dto.question_answer.quiz_model;

namespace quiz_me_server.code.dto.question_answer.db_model;

public class Question
{
    
    public long Id { set; get; }
    
    [NotNull]
    public string Content { set; get; }

    public List<Answer> Answers { set; get; } = new List<Answer>();

    public QuizQuestion GetQuizQuestion()
    {
        var quizQuestion = new QuizQuestion();

        var quizAnswers = this.Answers
            .Select(x => x.GetQuizAnswer())
            .ToList();

        quizQuestion.Id = this.Id;
        quizQuestion.Content = this.Content;
        quizQuestion.Answers = quizAnswers;

        return quizQuestion;
    }
}