using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
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
    public class AccountController : BaseApiController
    {
        private readonly ILogger<AccountController> _logger;
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;

        public AccountController(DataContext context, ITokenService tokenService)
        {
            _tokenService = tokenService;
            _context = context;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> RegisterUser (RegisterDto registerDto)
        {
            if (await UserExists(registerDto.UserName)) return BadRequest("Username is taken");

            if (await EmailExists(registerDto.Email)) return BadRequest("Email is taken");


            var user = new User
            {
                UserName = registerDto.UserName.ToLower(),
                Email = registerDto.Email.ToLower(),
                PasswordHash = HashPassword(registerDto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = await _tokenService.CreateToken(user.UserName, user.Id);

            return Ok(
                new UserDto
                {
                    UserName = user.UserName,
                    Email = user.Email,
                    Token = token
                });

        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> LoginUser (LoginDto loginDto)
        {
            try
            {
                var user = await _context.Users
                   .SingleOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());

                if (user == null) return Unauthorized("Invalid username");

                if (!VerifyPassword(loginDto.Password, user.PasswordHash))
                    return Unauthorized("Invalid password");

                var token = await _tokenService.CreateToken(user.UserName, user.Id);

                return Ok(
                    new UserDto
                    {
                        UserName = user.UserName,
                        Email = user.Email,
                        Token = token
                    });
            }
            catch (Exception ex)
            {
            
                return StatusCode(500, "Internal server error" + ex.Message);
            
           }
        }




        private string HashPassword(string password)
        {
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            var bytes = System.Text.Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        // Helper method to verify password
        private bool VerifyPassword(string password, string storedHash)
        {
            var hashOfInput = HashPassword(password);
            return hashOfInput == storedHash;
        }


        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        }

        private async Task<bool> EmailExists(string email)
        {
            return await _context.Users.AnyAsync(x => x.Email == email.ToLower());
        }
    }
}