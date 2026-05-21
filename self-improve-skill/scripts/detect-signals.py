#!/usr/bin/env python3
"""
Detect skill signals from conversation text.
Usage: echo "conversation text" | python detect-signals.py
"""

import sys
import re

# Signal patterns
SIGNALS = {
    "user_correction": [
        r"stop doing",
        r"don't (do|format|use)",
        r"this is too (verbose|long|short)",
        r"why are you",
        r"just give me",
        r"you always do",
        r"I hate (it|when)",
        r"remember this",
        r"don't do that again",
    ],
    "technique_discovered": [
        r"workaround",
        r"debugging path",
        r"fix(ed|ing)",
        r"solution",
        r"pattern",
    ],
    "skill_outdated": [
        r"skill is (wrong|outdated|missing)",
        r"doesn't work anymore",
        r"deprecated",
    ],
}

def detect_signals(text: str) -> dict:
    """Detect skill signals in text."""
    found = {}
    for category, patterns in SIGNALS.items():
        matches = []
        for pattern in patterns:
            if re.search(pattern, text, re.IGNORECASE):
                matches.append(pattern)
        if matches:
            found[category] = matches
    return found

if __name__ == "__main__":
    text = sys.stdin.read()
    signals = detect_signals(text)
    
    if signals:
        print("🎯 Skill signals detected:")
        for category, patterns in signals.items():
            print(f"  {category}: {len(patterns)} matches")
    else:
        print("No strong skill signals detected")
