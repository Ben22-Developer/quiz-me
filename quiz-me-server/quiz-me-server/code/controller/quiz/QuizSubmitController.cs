using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using quiz_me_server.code.dto.question_answer.quiz_model;
using quiz_me_server.code.service.question_answer.quiz_mark;

namespace quiz_me_server.code.controller.quiz;

[Route("/api/server/v1/quiz-submit")]
[ApiController]
[Authorize]
public class QuizSubmitController (QuizSubmitService quizSubmitService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> PostQuizSubmission ([FromBody] UserQuizAnswer userQuizAnswer)
    {
        return Ok(await quizSubmitService.PostQuizSubmission(userQuizAnswer));
    }
}