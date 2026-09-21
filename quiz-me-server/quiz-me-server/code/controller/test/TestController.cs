using Microsoft.AspNetCore.Mvc;

namespace quiz_me_server.code.controller.test;

[ApiController]
[Route("/api/server/v1/test")]
public class TestController : ControllerBase
{
    [HttpGet]
    public IActionResult GetTest()
    {
        return Ok("Get test");
    }
    
    [HttpPost]
    public IActionResult PostTest()
    {
        return Ok("Post test");
    }
    
    [HttpPatch]
    public IActionResult PatchTest()
    {
        return Ok("Patch test");
    }
        
    [HttpDelete]
    public IActionResult DeleteTest()
    {
        return Ok("Delete test");
    }
}