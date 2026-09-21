using System.Diagnostics.CodeAnalysis;

namespace quiz_me_server.code.dto.question_answer.quiz_model;

public class QuizAnswer
{
    public long Id { set; get; }
    
    [NotNull]
    public string Content { set; get; }
}