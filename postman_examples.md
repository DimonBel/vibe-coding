# Postman Request Examples for Groq API Server

## 1. Ask Endpoint (Using Groq Client)

**Request Details:**
- Method: POST
- URL: `http://localhost:5000/ask`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body (raw JSON):
  ```json
  {
      "question": "Explain the importance of fast language models"
  }
  ```

**Expected Response:**
```json
{
    "response": "Fast language models are crucial for several reasons..."
}
```

## 2. Curl Endpoint (Using Direct API Call)

**Request Details:**
- Method: POST
- URL: `http://localhost:5000/curl`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body (raw JSON):
  ```json
  {
      "question": "Explain the importance of fast language models"
  }
  ```

**Expected Response:**
```json
{
    "id": "chatcmpl-...",
    "object": "chat.completion",
    "created": 1234567890,
    "model": "meta-llama/llama-4-scout-17b-16e-instruct",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "Fast language models are crucial for several reasons..."
            },
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 10,
        "completion_tokens": 100,
        "total_tokens": 110
    }
}
```

## Postman Collection Import

You can import these requests into Postman by creating a new collection and adding the following requests:

1. Create a new collection named "Groq API Server"
2. Add two requests with the details above
3. Save the requests

## Testing Different Questions

You can test with various questions by modifying the request body. Here are some examples:

```json
{
    "question": "What are the key features of modern AI models?"
}
```

```json
{
    "question": "How do language models impact daily life?"
}
```

```json
{
    "question": "Explain quantum computing in simple terms"
}
```

## Error Cases

If you send an invalid request (missing question), you'll get an error response:

```json
{
    "error": "Please provide a question"
}
```

## Notes
- Make sure the Flask server is running on port 5000
- Both endpoints expect a JSON body with a "question" field
- The `/ask` endpoint returns a simplified response
- The `/curl` endpoint returns the full API response with metadata 