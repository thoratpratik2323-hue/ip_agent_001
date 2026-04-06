import subprocess
import os

def execute_bash(command):
    """Executes a bash/cmd command and returns output."""
    try:
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.stdout + result.stderr
    except Exception as e:
        return str(e)

def write_file(path, content):
    """Writes content to a file."""
    try:
        # Resolve path relative to repo root
        root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        full_path = os.path.join(root, path)
        
        # Create directories if missing
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        return f"Successfully wrote {len(content)} bytes to {path}."
    except Exception as e:
        return f"Error writing file: {str(e)}"

def read_file(path):
    """Reads a file's contents."""
    try:
        root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        full_path = os.path.join(root, path)
        with open(full_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        return f"Error reading file: {str(e)}"

def tool_handler(name, payload):
    """Routes to the real implementation of tools."""
    # The payload is often JSON or a raw string/prompt from the LLM
    # For now, we'll try to parse it
    
    if name == "BashTool":
        return execute_bash(payload)
    elif name == "FileWriteTool":
        # Expecting string like "path|content" or similar shim for now
        # In a real agent, payload would be structured
        if "|" in payload:
            path, content = payload.split("|", 1)
            return write_file(path.strip(), content)
        return write_file("generated_code.py", payload) # Default
    elif name == "FileReadTool":
        return read_file(payload.strip())
    
    return f"Tool {name} is mirrored but no real I/O handler implemented yet."
