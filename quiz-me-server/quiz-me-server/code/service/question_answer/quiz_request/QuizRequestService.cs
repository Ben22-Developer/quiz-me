using quiz_me_server.code.dto;
using quiz_me_server.code.dto.chunk;
using quiz_me_server.code.dto.question_answer.db_model;
using quiz_me_server.code.dto.question_answer.quiz_model;
using quiz_me_server.code.service.chunk_service;

namespace quiz_me_server.code.service.question_answer.quiz_request;

public class QuizRequestService (QuestionService questionService)
{

    private static readonly int ToTakeQuestions = 3; 
    
    public async Task<QuizRequest> ReadQuiz(Chunk chunk)
    {
        ValidateChunk(chunk);
        
        List<Question> questions = new List<Question>();

        ChunkService chunkService = new ChunkService();

        while (questions.Count < ToTakeQuestions)
        {
            List<Question> questionByShuffle = await questionService.ReadQuestionByShuffle(chunk);
            questions.AddRange(questionByShuffle);
            chunkService.SetNextChunk(questions.Count, questionByShuffle.Count, ToTakeQuestions, chunk);
        }
        
        return new QuizRequest(ReadQuizQuestion(questions), chunk, DateTime.Now);
    }

    private void ValidateChunk(Chunk chunk)
    {
        if (chunk.Skip < 0 || chunk.Skip > ToTakeQuestions)
            chunk.Skip = 0;

        if (chunk.Take < 0 || chunk.Take > ToTakeQuestions)
            chunk.Take = ToTakeQuestions;
    }

    private List<QuizQuestion> ReadQuizQuestion (List<Question> questions)
    {
        return questions
            .Select(x => x.GetQuizQuestion())
            .ToList();
    }
}