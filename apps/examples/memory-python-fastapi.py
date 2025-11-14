"""
Python FastAPI Example - Using Memory System via REST API

This example shows how to use the memory system from Python by calling
the Node.js memory service API.

Alternatively, you could port the memory system to Python or use it via
a microservice architecture.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx
from typing import Optional, List

app = FastAPI()

# Memory service API endpoint (Node.js service)
MEMORY_SERVICE_URL = "http://localhost:3000/api"


class ChatRequest(BaseModel):
    user_id: str
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    memories_used: int
    tokens_used: int


class PreferenceRequest(BaseModel):
    key: str
    value: str


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint that uses memory service for context
    """
    try:
        async with httpx.AsyncClient() as client:
            # Call memory service to get relevant context
            memory_response = await client.post(
                f"{MEMORY_SERVICE_URL}/chat",
                json={
                    "userId": request.user_id,
                    "message": request.message,
                    "sessionId": request.session_id,
                },
            )
            memory_response.raise_for_status()
            
            data = memory_response.json()
            
            return ChatResponse(
                response=data["response"],
                memories_used=data["memoriesUsed"],
                tokens_used=data.get("tokensUsed", 0),
            )
            
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/preferences/{user_id}")
async def set_preference(user_id: str, preference: PreferenceRequest):
    """
    Set user preference
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{MEMORY_SERVICE_URL}/preferences/{user_id}",
                json={
                    "key": preference.key,
                    "value": preference.value,
                },
            )
            response.raise_for_status()
            
            return {"success": True}
            
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/preferences/{user_id}")
async def get_preferences(user_id: str):
    """
    Get user preferences
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{MEMORY_SERVICE_URL}/preferences/{user_id}"
            )
            response.raise_for_status()
            
            return response.json()
            
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/stats")
async def get_stats():
    """
    Get memory statistics
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{MEMORY_SERVICE_URL}/stats")
            response.raise_for_status()
            
            return response.json()
            
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    
    print("Starting Python FastAPI server...")
    print("Make sure Node.js memory service is running on port 3000")
    print("Start with: uvicorn memory-python-fastapi:app --port 8000")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
