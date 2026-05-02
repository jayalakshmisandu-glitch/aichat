using System;
using System.Collections.Concurrent;
using System.Security.Cryptography;
using System.Text;

namespace Backend.Services
{
    public class UserStore
    {
        private readonly ConcurrentDictionary<string, string> _users = new ConcurrentDictionary<string, string>();

        public bool TryCreate(string email, string password)
        {
            return _users.TryAdd(NormalizeEmail(email), Hash(password));
        }

        public bool Validate(string email, string password)
        {
            return _users.TryGetValue(NormalizeEmail(email), out var hash) && hash == Hash(password);
        }

        private static string NormalizeEmail(string email)
        {
            return email.Trim().ToLowerInvariant();
        }

        private static string Hash(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
