using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;
using quiz_me_server.code.dto.question_answer.db_model;
using quiz_me_server.code.dto.question_answer.quiz_model;

namespace quiz_me_server.code.dto.question_answer.db_model;

public class Answer
{
    public long Id { set; get; }
    
    [NotNull]
    public string Content { set; get; } = null!;
    
    [NotNull]
    public Question Question { set; get; } = null!;
    
    [NotNull]
    public bool IsTrue { set; get; }

    public QuizAnswer GetQuizAnswer()
    {
        var quizAnswer = new QuizAnswer();

        quizAnswer.Id = this.Id;
        quizAnswer.Content = this.Content;

        return quizAnswer;
    }
}