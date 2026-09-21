using quiz_me_server.code.dto;
using quiz_me_server.code.dto.question_answer.db_model;

namespace quiz_me_server.code.repository.contract;

public interface IAnswerRepositoryContract
{
    public Task<List<Answer>> ReadTrueAnswerOfQuestion(HashSet<long> questionIds);
}