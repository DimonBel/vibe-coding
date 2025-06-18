from groq import Groq

client = Groq(api_key="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")
completion = client.chat.completions.create(
    model="meta-llama/llama-4-scout-17b-16e-instruct",
    messages=[
        {"role": "user", "content": "What are some fun things to do in New York?"}
    ],
    temperature=1,
    max_completion_tokens=1024,
    top_p=1,
    stream=True,
    stop=None,
)

for chunk in completion:
    print(chunk.choices[0].delta.content or "", end="")
