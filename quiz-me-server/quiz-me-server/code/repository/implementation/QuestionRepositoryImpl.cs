using Microsoft.EntityFrameworkCore;
using quiz_me_server.code.database;
using quiz_me_server.code.dto.chunk;
using quiz_me_server.code.dto.question_answer.db_model;
using quiz_me_server.code.repository.contract;

namespace quiz_me_server.code.repository.implementation;

public class QuestionRepositoryImpl (QuizMeDatabaseContext _dbContext, IAnswerRepositoryContract answerRepositoryContract) : IQuestionRepositoryContract
{

    public async Task<int> CreateQuestion(List<Question> models)
    {
        await _dbContext.Question.AddRangeAsync(models);
        return await _dbContext.SaveChangesAsync();
    }

    public async Task<int> UpdateQuestion(List<Question> model)
    {
        _dbContext.Question.UpdateRange(model);
        return await _dbContext.SaveChangesAsync();
    }

    public async Task<List<Question>> ReadQuestionByChunk (Chunk chunk)
    {
        return await _dbContext.Question
            .Skip(chunk.Skip)
            .Take(chunk.Take)
            .ToListAsync();
    }

    public async Task<List<Question>> ReadQuestionByIds (HashSet<long> ids)
    {
        return await _dbContext.Question
            .Where(x => ids.Contains(x.Id))
            .ToListAsync();
    }

    public async Task<List<Question>> ReadQuestionByShuffle(Chunk chunk)
    {
        var x =await _dbContext.Question
            .Skip(chunk.Skip)
            .Take(chunk.Take)
            .Include(x => x.Answers)
            .ToListAsync();

        return x.Shuffle().ToList();
    }

    public async Task<Dictionary<long, long>> ReadQuestionTrueAnswerId(HashSet<long> questionIds)
    {
        Dictionary<long, long> dictionary = new Dictionary<long, long>();
        
        List<Answer> answers = await answerRepositoryContract.ReadTrueAnswerOfQuestion(questionIds);

        foreach (var answer in answers)
        {
            dictionary.Add(answer.Question.Id, answer.Id);

            if (!questionIds.Contains(answer.Question.Id)) throw new Exception("Found an answer not in suggested question IDs");
        }

        return dictionary;
    }

    public async Task<int> DeleteQuestion(HashSet<long> ids)
    {
        return await _dbContext.Question
            .Where(x => ids.Contains(x.Id))
            .ExecuteDeleteAsync();
    }
}