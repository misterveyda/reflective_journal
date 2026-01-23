"""
Utility functions for summarizing journal entries.
"""
from datetime import datetime
from typing import List, Optional
from .models import JournalEntry


def summarize_entries(entries: List[JournalEntry], max_length: int = 500) -> str:
    """
    Generate a summary from multiple journal entries.
    
    Args:
        entries: List of JournalEntry objects to summarize
        max_length: Maximum length of summary (in characters)
    
    Returns:
        A summary string
    """
    if not entries:
        return "No entries to summarize."
    
    # Simple extractive summary - takes key sentences
    summary_parts = []
    
    for entry in entries:
        # Add mood context if available
        if entry.mood:
            mood_text = entry.get_mood_display()
            summary_parts.append(f"[{mood_text}] {entry.title or 'Untitled'}")
        
        # Add first 200 chars of content
        if entry.content:
            summary_parts.append(entry.content[:200] + "...")
        
        summary_parts.append("---")
    
    summary_text = "\n".join(summary_parts)
    
    # Truncate if necessary
    if len(summary_text) > max_length:
        summary_text = summary_text[:max_length] + "..."
    
    return summary_text


def extract_themes(entries: List[JournalEntry]) -> dict:
    """
    Extract themes and patterns from journal entries.
    
    Returns a dict with:
    - most_common_mood: Most frequent mood in entries
    - tags: Frequency of tags used
    - entry_count: Total entries analyzed
    """
    if not entries:
        return {"entry_count": 0}
    
    mood_counts = {}
    tag_counts = {}
    
    for entry in entries:
        # Count moods
        if entry.mood:
            mood_counts[entry.mood] = mood_counts.get(entry.mood, 0) + 1
        
        # Count tags
        if entry.tags:
            tags = [tag.strip() for tag in entry.tags.split(',')]
            for tag in tags:
                if tag:
                    tag_counts[tag] = tag_counts.get(tag, 0) + 1
    
    most_common_mood = max(mood_counts, key=mood_counts.get) if mood_counts else None
    
    return {
        "entry_count": len(entries),
        "most_common_mood": most_common_mood,
        "mood_distribution": mood_counts,
        "top_tags": sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)[:10],
    }
