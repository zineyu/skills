#!/usr/bin/env python3
"""
Validate a skill directory structure and content.
Usage: python validate-skill.py <skill-directory>
"""

import sys
import os
import re
from pathlib import Path

def validate_skill(skill_dir: str) -> list:
    """Validate skill structure. Returns list of errors."""
    errors = []
    path = Path(skill_dir)
    
    if not path.exists():
        return [f"Directory does not exist: {skill_dir}"]
    
    # Check SKILL.md exists
    skill_md = path / "SKILL.md"
    if not skill_md.exists():
        errors.append("Missing SKILL.md")
    else:
        content = skill_md.read_text()
        
        # Check frontmatter
        if not content.startswith("---"):
            errors.append("SKILL.md missing YAML frontmatter")
        else:
            # Extract frontmatter
            parts = content.split("---", 2)
            if len(parts) < 3:
                errors.append("Invalid frontmatter format")
            else:
                frontmatter = parts[1]
                
                # Check required fields
                if "name:" not in frontmatter:
                    errors.append("Missing 'name' in frontmatter")
                if "description:" not in frontmatter:
                    errors.append("Missing 'description' in frontmatter")
                
                # Validate name format
                name_match = re.search(r'name:\s*(.+)', frontmatter)
                if name_match:
                    name = name_match.group(1).strip().strip('"\'')
                    if not re.match(r'^[a-z0-9][a-z0-9._-]*$', name):
                        errors.append(f"Invalid skill name: '{name}'")
    
    # Check subdirectories
    allowed_dirs = {"references", "templates", "scripts", "assets"}
    for subdir in path.iterdir():
        if subdir.is_dir() and subdir.name.startswith("."):
            continue
        if subdir.is_dir() and subdir.name not in allowed_dirs:
            errors.append(f"Unexpected directory: {subdir.name}")
    
    return errors

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python validate-skill.py <skill-directory>")
        sys.exit(1)
    
    skill_dir = sys.argv[1]
    errors = validate_skill(skill_dir)
    
    if errors:
        print(f"❌ Validation failed for {skill_dir}:")
        for error in errors:
            print(f"  - {error}")
        sys.exit(1)
    else:
        print(f"✅ {skill_dir} is valid")
        sys.exit(0)
