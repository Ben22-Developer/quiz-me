namespace quiz_me_server.code.dto.question_answer.quiz_model;

public class UserQuizAnswer(Dictionary<long, long> questionIdToAnswerIdDictionary, int totalMarks)
{
    public Dictionary<long, long> QuestionIdToAnswerIdDictionary { get; set; } = questionIdToAnswerIdDictionary;
    public int TotalMarks { get; set; } = totalMarks;

    public UserQuizAnswer() : this(new Dictionary<long, long>(), 0) {}
}