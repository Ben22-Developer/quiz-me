using quiz_me_server.code.dto.chunk;

namespace quiz_me_server.code.dto.question_answer.quiz_model;

public class QuizRequest(List<QuizQuestion> quizQuestions, Chunk nextChunk, DateTime doneOn)
{
    public List<QuizQuestion> QuizQuestion { get; set; } = quizQuestions;

    public Chunk NextChunk { get; set; } = nextChunk;
    
    public DateTime DoneOn { get; } = doneOn;
}