using EduFlowAI.Responses;
using Microsoft.AspNetCore.Mvc;

namespace EduFlowAI.Controllers
{
    [ApiController]
    public abstract class BaseController : ControllerBase
    {
        protected IActionResult Success<T>(T data,string message = "Success")
        {
            return Ok(new APIResponse<T>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = message,
                Data = data
            });
        }

        protected IActionResult CreatedResponse<T>(T data,string message = "Created Successfully")
        {
            return StatusCode(StatusCodes.Status201Created,
                new APIResponse<T>
                {
                    StatusCode = StatusCodes.Status201Created,
                    Message = message,
                    Data = data
                });
        }

        protected IActionResult NoContentResponse(string message = "Success")
        {
            return Ok(new APIResponse<object>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = message,
                Data = null
            });
        }

    }
}
