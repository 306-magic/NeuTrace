"""
NeuTrace Sandbox Runtime
Isolated subprocess execution engine with telemetry tracking and timeout protection.
"""

import os
import subprocess
import sys
import tempfile
import time
from typing import Any, Dict


class SecuritySandbox:
    """
    Executes untrusted code in an isolated subprocess with strict telemetry,
    resource limits, and environment variable isolation.
    """

    def __init__(self, timeout_seconds: float = 2.5):
        self.timeout_seconds = timeout_seconds

    def execute(self, code: str) -> Dict[str, Any]:
        """
        Writes code to a secure temporary script, runs it in an isolated
        subprocess, and returns structured execution telemetry.
        """
        temp_file_path = None
        start_time = time.perf_counter()

        try:
            # 1. Create temporary script file (closed immediately for Windows compatibility)
            with tempfile.NamedTemporaryFile(
                mode="w", suffix=".py", delete=False, encoding="utf-8"
            ) as temp_script:
                temp_script.write(code)
                temp_file_path = temp_script.name

            # 2. Sanitize environment to prevent sandboxed code from reading host API keys
            safe_env = {
                "SYSTEMROOT": os.environ.get("SYSTEMROOT", ""),
                "PATH": os.environ.get("PATH", ""),
                "PYTHONPATH": "",
            }

            # 3. Execute isolated subprocess
            result = subprocess.run(
                [sys.executable, temp_file_path],
                capture_output=True,
                text=True,
                timeout=self.timeout_seconds,
                env=safe_env,
            )

            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
            is_success = result.returncode == 0

            return {
                "success": is_success,
                "status": "SUCCESS" if is_success else "CRASH_ERROR",
                "exit_code": result.returncode,
                "stdout": result.stdout.strip(),
                "stderr": result.stderr.strip(),
                "duration_ms": duration_ms,
            }

        except subprocess.TimeoutExpired:
            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
            return {
                "success": False,
                "status": "TIMEOUT_EXCEEDED",
                "exit_code": -1,
                "stdout": "",
                "stderr": f"Execution terminated: Exceeded the {self.timeout_seconds}s safety threshold.",
                "duration_ms": duration_ms,
            }

        except Exception as exc:
            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
            return {
                "success": False,
                "status": "SYSTEM_ERROR",
                "exit_code": -1,
                "stdout": "",
                "stderr": f"Sandbox driver error: {str(exc)}",
                "duration_ms": duration_ms,
            }

        finally:
            # Clean up the temporary execution artifact
            if temp_file_path and os.path.exists(temp_file_path):
                try:
                    os.remove(temp_file_path)
                except OSError:
                    pass


if __name__ == "__main__":
    # Quick self-test
    sandbox = SecuritySandbox(timeout_seconds=1.5)
    print("Testing valid script:")
    print(sandbox.execute("print('Sandbox online.')"))

    print("\nTesting runtime error trap:")
    print(sandbox.execute("x = 1 / 0"))

    print("\nTesting infinite loop trap:")
    print(sandbox.execute("while True: pass"))