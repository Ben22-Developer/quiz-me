namespace quiz_me_server.code.dto.question_answer.quiz_marks;

public class QuizMark (int userMarks, int totalMarks, Dictionary<long, long> questionIdToAnswerIdMap , DateTime doneOn)
{
    public int UserMarks { get; set; } = userMarks;    
    
    public int TotalMarks { get; set; } = totalMarks;
    
    public Dictionary<long, long> QuestionIdToAnswerIdMap = questionIdToAnswerIdMap;
    
    public double Average {  set; get; } 
    
    public string Suggestion { set; get; }
    
    public DateTime DoneOn { get; set; } = doneOn;
}

public enum Suggestion
{
    EXCELLENT, GOOD, BAD
}