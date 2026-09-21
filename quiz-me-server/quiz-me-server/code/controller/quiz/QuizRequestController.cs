using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using quiz_me_server.code.dto.chunk;
using quiz_me_server.code.service.question_answer.quiz_request;

namespace quiz_me_server.code.controller.quiz;

[Route("/api/server/v1/quiz-request")]
[ApiController]
[Authorize]
public class QuizRequestController (QuizRequestService quizRequestService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> ReadQuiz ([FromQuery] int skip, [FromQuery] int take)
    {
        Chunk chunk = new Chunk(skip, take);
        return Ok(await quizRequestService.ReadQuiz(chunk));
    }
}