

using Microsoft.Extensions.Caching.Distributed;
using System.Text;
using System.Text.Json;

namespace ProfiWay.Application.Services.RedisServices;

public class RedisCacheService : IRedisService
{
    private readonly IDistributedCache _distributedCache;

    public RedisCacheService(IDistributedCache distributedCache)
    {
        _distributedCache = distributedCache;
    }

    public async Task AddDataAsync<T>(string key, T value)
    {
        var jsonData = JsonSerializer.Serialize(value);

        byte[] dataBytes = Encoding.UTF8.GetBytes(jsonData);

        var options = new DistributedCacheEntryOptions
        {
            SlidingExpiration = TimeSpan.FromMinutes(5),
        };

        await _distributedCache.SetAsync(key, dataBytes, options);
    }

    public async Task<T> GetDataAsync<T>(string key)
    {
        byte[] datas = await _distributedCache.GetAsync(key);

        if (datas is null)
        {
            return default;
        }

        var jsonData = Encoding.UTF8.GetString(datas);

        T response = JsonSerializer.Deserialize<T>(jsonData);

        return response;
    }

    public async Task RemoveDataAsync(string key)
    {
        await _distributedCache.RemoveAsync(key);
    }
}
