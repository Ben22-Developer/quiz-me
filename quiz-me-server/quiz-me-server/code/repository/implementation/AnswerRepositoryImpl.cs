using Microsoft.EntityFrameworkCore;
using quiz_me_server.code.database;
using quiz_me_server.code.dto;
using quiz_me_server.code.dto.question_answer.db_model;
using quiz_me_server.code.repository.contract;

namespace quiz_me_server.code.repository.implementation;

public class AnswerRepositoryImpl (QuizMeDatabaseContext databaseContext) : IAnswerRepositoryContract
{
    public async Task<List<Answer>> ReadTrueAnswerOfQuestion(HashSet<long> questionIds)
    {
        return await databaseContext.Answer
            .Where(x => questionIds.Contains(x.Question.Id) && x.IsTrue)
            .Include(x => x.Question)
            .ToListAsync();
    }
}