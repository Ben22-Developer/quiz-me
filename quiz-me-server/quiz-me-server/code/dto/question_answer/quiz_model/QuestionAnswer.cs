using System.Diagnostics.CodeAnalysis;

namespace quiz_me_server.code.dto.question_answer.quiz_model;

public class QuestionAnswer(int questionId, int answerId)
{
    [NotNull]
    public int QuestionId { set; get; } = questionId;

    [NotNull]
    public int AnswerId { set; get; } = answerId;
}