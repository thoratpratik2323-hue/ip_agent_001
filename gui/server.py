from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess
import os
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="IP Codemaker Agent | Backend API")

# Add CORS for React Frontend
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
    """Returns general system status and health check summary."""
    return {
        "status": "online",
        "model": "NVIDIA LLaMa 3.1-405B",
        "tokens": 4096,
        "workspace": "IP-Codemaker-Agent",
        "health": "Clean"
    }

@app.post("/api/execute")
async def execute_command(req: CommandRequest):
    """Executes a command using the Claw Code CLI binary or Python fallback."""
    try:
        # Repository root (one level up from /gui/)
        repo_root = os.path.abspath(os.path.join(os.getcwd(), ".."))
        
        # 1. Try Rust Binary (Target for production/speed)
        binary_path = os.path.join(repo_root, "rust", "target", "debug", "claw.exe")
        
        if os.path.exists(binary_path):
            process = subprocess.Popen(
                [binary_path, "prompt", req.command],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                cwd=repo_root
            )
            stdout, stderr = process.communicate(timeout=60)
            if process.returncode != 0:
                return {"output": stderr or stdout, "error": True}
            return {"output": stdout, "error": False}

        # 2. Fallback to Python Implementation (src/main.py)
        # Using -m src.main to correctly handle relative imports in the Python port
        python_process = subprocess.Popen(
            ["python", "-m", "src.main", "oneshot", req.command],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            cwd=repo_root
        )
        
        stdout, stderr = python_process.communicate(timeout=60)
        
        if python_process.returncode == 0:
            return {"output": stdout, "error": False}
        else:
            return {"output": f"[Backend] Both Rust binary and Python fallback failed.\nSTDOUT: {stdout}\nSTDERR: {stderr}", "error": True}

    except Exception as e:
        return {"output": f"Internal Server Error: {str(e)}", "error": True}

@app.get("/api/files")
async def list_files():
    """Lists files in the current workspace for the GUI explorer."""
    try:
        root_dir = os.path.abspath(os.path.join(os.getcwd(), ".."))
        files = []
        for root, dirs, filenames in os.walk(root_dir):
            # Ignore hidden dirs and gui dir to keep it clean
            if ".git" in root or "node_modules" in root or ".claw" in root:
                continue
            for f in filenames:
                rel_path = os.path.relpath(os.path.join(root, f), root_dir)
                files.append(rel_path)
        return {"files": files[:50]} # Top 50 files for UI
    except Exception as e:
        return {"files": [], "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
