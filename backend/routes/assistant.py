import logging
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

logging.basicConfig(level=logging.INFO)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(tags=["assistant"])

@router.post("/webhook")
async def vapi_webhook(request: Request):
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

    response_content = {
        "results": [
            {
                "toolCallId": tool_call_id,
                "result": "Hello! How can I assist you today?"
            }
        ]
    }
    return JSONResponse(content=response_content)
