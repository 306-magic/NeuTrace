"""
NeuTrace Sentinel Agent
Performs zero-trust static analysis via AST to block malicious or unauthorized code execution.
"""

import ast
from typing import Tuple, List

class SecuritySentinel(ast.NodeVisitor):
    """
    Traverses the Abstract Syntax Tree of the target code to detect 
    banned imports, unauthorized function calls, and dangerous patterns.
    """
    
    # The whitelist of safe modules. Everything else is blocked.
    ALLOWED_MODULES = {"math", "datetime", "json", "collections", "re", "itertools", "typing"}
    
    def __init__(self):
        self.is_safe = True
        self.violations: List[str] = []

    def visit_Import(self, node: ast.Import):
        """Traps 'import x' statements."""
        for alias in node.names:
            if alias.name not in self.ALLOWED_MODULES:
                self.is_safe = False
                self.violations.append(f"CRITICAL: Unauthorized import '{alias.name}' blocked.")
        self.generic_visit(node)

    def visit_ImportFrom(self, node: ast.ImportFrom):
        """Traps 'from x import y' statements."""
        if node.module and node.module not in self.ALLOWED_MODULES:
            self.is_safe = False
            self.violations.append(f"CRITICAL: Unauthorized module '{node.module}' blocked.")
        self.generic_visit(node)
        
    def visit_Call(self, node: ast.Call):
        """Traps dangerous built-in function calls (e.g., eval, exec, open)."""
        if isinstance(node.func, ast.Name):
            banned_functions = {"eval", "exec", "open", "compile", "globals", "locals"}
            if node.func.id in banned_functions:
                self.is_safe = False
                self.violations.append(f"CRITICAL: Dangerous function call '{node.func.id}()' blocked.")
        self.generic_visit(node)


def scan_code(code: str) -> Tuple[bool, str]:
    """
    Main entry point for the Sentinel Agent. 
    Returns (True, "SAFE") or (False, "Violation details").
    """
    try:
        # Parse the code into an AST structure
        tree = ast.parse(code)
    except SyntaxError as e:
        return False, f"SYNTAX_ERROR: {str(e)}"

    # Run the security walker
    sentinel = SecuritySentinel()
    sentinel.visit(tree)

    if not sentinel.is_safe:
        return False, " | ".join(sentinel.violations)
        
    return True, "SAFE"


if __name__ == "__main__":
    # Self-Test
    print("Testing safe code:")
    safe_script = "import math\nprint(math.sqrt(16))"
    print(scan_code(safe_script))

    print("\nTesting malicious code:")
    malicious_script = "import os\nos.system('echo hacked')\neval('2+2')"
    print(scan_code(malicious_script))