import logging
from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import asyncio
import openai
import os

from qdrant_client import QdrantClient
from qdrant_client.http import models as rest

from ..database import get_db  # your sync DB session dependency

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(tags=["assistant"])

# Setup OpenAI key
openai.api_key = os.getenv("OPENAI_API_KEY")

# Qdrant client setup
QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", "6333"))
COLLECTION_NAME = "companies"

client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)

def embed(text: str):
    response = openai.Embedding.create(
        input=text,
        model="text-embedding-3-small"
    )
    return response['data'][0]['embedding']

def gpt_answer(details: str, question: str):
    prompt = f"""Company Details:
{details}

Answer the question based only on the above:
{question}"""

    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=150,
        temperature=0.2
    )
    return response['choices'][0]['message']['content']

@router.post("/webhook")
async def vapi_webhook(request: Request, db: Session = Depends(get_db)):
    data = await request.json()

    # Extract toolCallId safely, fallback to "no-id"
    tool_call_id = "no-id"
    try:
        message = data.get("message", {})
        tool_calls = message.get("toolCalls", [])
        if tool_calls:
            tool_call = tool_calls[0]
            tool_call_id = tool_call.get("toolCallId") or tool_call.get("id") or "no-id"
    except Exception:
        pass

    # Extract user question from payload (adjust this depending on actual payload)
    user_question = (
        data.get("message", {}).get("text") or
        data.get("question") or
        "Tell me about the company"
    )

    # Run embedding + Qdrant search + GPT in thread pool to avoid blocking event loop
    async def process_question(question: str):
        question_vector = await asyncio.to_thread(embed, question)

        search_result = await asyncio.to_thread(
            lambda: client.search(
                collection_name=COLLECTION_NAME,
                query_vector=question_vector,
                limit=1,
                with_payload=True,
            )
        )

        if not search_result:
            return "Sorry, I couldn't find information related to your question."

        top_hit = search_result[0]
        details = top_hit.payload.get("details", "")

        answer = await asyncio.to_thread(gpt_answer, details, question)
        return answer

    result_text = await process_question(user_question)

    response_content = {
        "results": [
            {
                "toolCallId": tool_call_id,
                "result": result_text,
            }
        ]
    }

    return JSONResponse(content=response_content)
