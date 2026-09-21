using quiz_me_server.code.dto;
using quiz_me_server.code.dto.chunk;
using quiz_me_server.code.dto.question_answer.db_model;
using quiz_me_server.code.repository.contract;

namespace quiz_me_server.code.service;

public class QuestionService  (IQuestionRepositoryContract questionRepositoryContract)
{
    public async Task<List<Question>> ReadQuestionByShuffle(Chunk chunk)
    {
        return await questionRepositoryContract.ReadQuestionByShuffle(chunk);
    }

    public async Task<Dictionary<long, long>> ReadTrueQuestionIdToAnswerId (HashSet<long> questionIds)
    {
        return await questionRepositoryContract.ReadQuestionTrueAnswerId(questionIds);
    }
}