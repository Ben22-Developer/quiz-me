using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace quiz_me_server.code.service.client_request;

public class ClientRequestService
{
    public async Task<string> MakeFormUrlEncodedContentRequest (HttpClient httpClient, string url, Dictionary<string, string> content, params string[] responseFailMessage)
    {
        HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, url);
        
        request.Content = new FormUrlEncodedContent(content);
        
        HttpResponseMessage httpResponseMessage = await httpClient.SendAsync(request);
        
        if (!httpResponseMessage.IsSuccessStatusCode)
            throw new Exception(responseFailMessage.Length == 0 ? await httpResponseMessage.Content.ReadAsStringAsync() : responseFailMessage[0]);
            

        return await httpResponseMessage.Content.ReadAsStringAsync();
    }

    public async Task<Dictionary<string, object>> GetUserCredentialsByBearerAccessToken (HttpClient httpClient, string url, string accessToken)
    {
        HttpRequestMessage httpRequestMessage = new HttpRequestMessage();

        httpRequestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer",accessToken);

        httpRequestMessage.RequestUri = new Uri(url);
        
        HttpResponseMessage httpResponseMessage = await httpClient.SendAsync(httpRequestMessage);

        string body = await httpResponseMessage.Content.ReadAsStringAsync();

        if ((string.IsNullOrEmpty(body)))
            throw new Exception();

        return JsonSerializer.Deserialize<Dictionary<string, object>>(body);
    }
}