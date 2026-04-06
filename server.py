from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import sys
import io
from contextlib import redirect_stdout
from fastapi.middleware.cors import CORSMiddleware

# --- DYNAMIC MEMORY LINK ---
# We are now in the PROJECT ROOT, so 'src' is directly accessible!
try:
    from src.main import main as run_engine
    from src.query_engine import QueryEnginePort
    ENGINE_AVAILABLE = True
except ImportError as e:
    print(f"[CRITICAL] Backend Discovery Failed: {e}")
    ENGINE_AVAILABLE = False

app = FastAPI(title="IP Codemaker Agent | Root Core")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class CommandRequest(BaseModel):
    command: str

@app.get("/api/status")
async def get_status():
    return {
        "status": "online",
        "model": "ip_agent_001 (Root Synced)",
        "engine": "active" if ENGINE_AVAILABLE else "error",
        "health": "Synchronized"
    }

@app.post("/api/execute")
async def execute_command(req: CommandRequest):
    """Direct Memory Execution for ip_agent_001."""
    if not ENGINE_AVAILABLE:
        return {"output": "### [CORE_UNAVAILABLE]\nNeural engine failed to load. Check root directory.", "error": True}

    cmd = req.command.lower()
    is_coding_task = any(k in cmd for k in ["code", "rust", "function", "write", "script", "create", "fix", "error", "build", "debug"])
    source_label = "### [CLAW_CORE_ACTIVE]" if is_coding_task else "### [LLAMA_COGNITION]"

    try:
        f = io.StringIO()
        with redirect_stdout(f):
            # Direct in-memory call for speed and reliability
            run_engine(["oneshot", req.command])
        
        output = f.getvalue()
        return {"output": f"{source_label}\n\n{output}", "error": False}
    except Exception as e:
        return {"output": f"### [RUNTIME_ERROR]\n{str(e)}", "error": True}

@app.get("/api/files")
async def list_files():
    try:
        files = []
        for root, dirs, filenames in os.walk("."):
            if any(x in root for x in [".git", "node_modules", ".claw", "gui"]): continue
            for f in filenames:
                files.append(os.path.relpath(os.path.join(root, f), "."))
        return {"files": files[:50]}
    except:
        return {"files": []}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
