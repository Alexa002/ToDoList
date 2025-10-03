using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ToDoListApi.Data;
using ToDoListApi.DTOs;
using ToDoListApi.Entities;
using ToDoListApi.Interfaces;

namespace ToDoListApi.Controllers
{
    [Authorize]
    [Route("task/")]
    public class TaskController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;

        public TaskController(DataContext context, ITokenService tokenService)
        {
            _tokenService = tokenService;
            _context = context;

        }

        // Helper method to get user ID from JWT token
        private int GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int userId = 0;
            int.TryParse(userIdClaim, out userId);
            return userId;
        }


        [HttpGet("tasks")]
        public async Task<ActionResult<List<TaskDto>>> GetTasks()
        {
            try
            {
                var userId = GetUserIdFromToken();
                var tasks = await _context.Tasks
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.Description,
                    t.IsCompleted,
                    t.CreatedAt,
                    t.DueDate
                }).ToListAsync();

                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving tasks: " + ex.Message });
            }
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<TaskDto>> GetTaskById(int id)
        {
            try
            {
                var userId = GetUserIdFromToken();
                var task = await _context.Tasks
                    .Where(t => t.UserId == userId && t.Id == id)
                    .Select(t => new TaskDto
                    {
                        Id = t.Id,
                        Title = t.Title,
                        Description = t.Description,
                        IsCompleted = t.IsCompleted,
                        CreatedAt = t.CreatedAt,
                        DueDate = t.DueDate
                    })
                    .FirstOrDefaultAsync();

                if (task == null)
                {
                    return NotFound(new { message = "Task not found" });
                }

                return Ok(task);
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An error occurred while retrieving the task: " + ex.Message });
            }
        }

        [HttpPut("update/{id}")]
        public async Task<ActionResult<TaskDto>> UpdateTask(int id, TaskDto taskDto)
        {
            try
            {
                var userId = GetUserIdFromToken();
                var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

                if (task == null)
                {
                    return NotFound(new { message = "Task not found" });
                }

                task.Title = taskDto.Title;
                task.Description = taskDto.Description;
                task.IsCompleted = taskDto.IsCompleted;
                task.DueDate = taskDto.DueDate;

                await _context.SaveChangesAsync();

                return Ok(new TaskDto
                {
                    Id = task.Id,
                    Title = task.Title,
                    Description = task.Description,
                    IsCompleted = task.IsCompleted,
                    CreatedAt = task.CreatedAt,
                    DueDate = task.DueDate
                });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An error occurred while updating the task: " + ex.Message });
            }
        }


        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> DeleteTask(int id)
        {
            try
            {
                var userId = GetUserIdFromToken();
                var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
                if (task == null)
                {
                    return NotFound(new { message = "Task not found" });
                }

                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Task deleted successfully" });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An error occurred while deleting the task: " + ex.Message });
            }
        }


        [HttpPatch("{id}/toggle")]
        public async Task<ActionResult<TaskDto>> ToggleTaskCompletion(int id)
        {
            try
            {
                var userId = GetUserIdFromToken();
                var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

                if (task == null)
                {
                    return NotFound(new { message = "Task not found" });
                }

                task.IsCompleted = !task.IsCompleted;
                await _context.SaveChangesAsync();

                return Ok(new TaskDto
                {
                    Id = task.Id,
                    Title = task.Title,
                    Description = task.Description,
                    IsCompleted = task.IsCompleted,
                    CreatedAt = task.CreatedAt,
                    DueDate = task.DueDate
                });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An error occurred while toggling the task completion: " + ex.Message });
            }
        }

        [HttpGet("completed")]
        public async Task<ActionResult<List<TaskDto>>> GetCompletedTasks()
        {
            try
            {
                var userId = GetUserIdFromToken();
                if (userId == 0) return Unauthorized(new { message = "Invalid or missing token" });

                var tasks = await _context.Tasks.Where(t => t.UserId == userId && t.IsCompleted)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    IsCompleted = t.IsCompleted,
                    CreatedAt = t.CreatedAt,
                    DueDate = t.DueDate
                })
                .ToListAsync();

                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving completed tasks: " + ex.Message });
            }
        }

        [HttpPost("create")]
        public async Task<ActionResult<TaskDto>> CreateTask(CreateTaskDto createTaskDto)
        {
            try
            {
                var userId = GetUserIdFromToken();
                if (userId == 0) return Unauthorized(new { message = "Invalid or missing token" });

                var task = new TaskToDo
                {
                    Title = createTaskDto.Title,
                    Description = createTaskDto.Description,
                    IsCompleted = false,
                    CreatedAt = DateTime.UtcNow,
                    DueDate = createTaskDto.DueDate,
                    UserId = userId
                };
                _context.Tasks.Add(task);
                await _context.SaveChangesAsync();

                return Ok(new TaskDto
                {
                    Id = task.Id,
                    Title = task.Title,
                    Description = task.Description,
                    IsCompleted = task.IsCompleted,
                    CreatedAt = task.CreatedAt,
                    DueDate = task.DueDate
                });

            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An error occurred while creating the task: " + ex.Message });
            }

        }

        [HttpGet("pending")]
        public async Task<ActionResult<List<TaskDto>>> GetPendingTasks()
        {
            try
            {
                var userId = GetUserIdFromToken();
                if (userId == 0) return Unauthorized(new { message = "Invalid or missing token" });

                var tasks = await _context.Tasks.Where(t => t.UserId == userId && !t.IsCompleted)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    IsCompleted = t.IsCompleted,
                    CreatedAt = t.CreatedAt,
                    DueDate = t.DueDate
                })
                .ToListAsync();

                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving pending tasks: " + ex.Message });
            }
        }


    }
}