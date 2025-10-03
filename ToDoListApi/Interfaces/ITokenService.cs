namespace ToDoListApi.Interfaces
{
    public interface ITokenService
    {
        Task<string> CreateToken(string username, int userId);

        bool ValidateToken(string token);
    }
}