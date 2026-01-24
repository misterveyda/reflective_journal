"""
Models for the journal app.
"""
from django.db import models
from django.contrib.auth.models import User


class JournalEntry(models.Model):
    """Model for journal entries."""
    
    MOOD_CHOICES = [
        ('happy', '😊 Happy'),
        ('sad', '😢 Sad'),
        ('neutral', '😐 Neutral'),
        ('anxious', '😰 Anxious'),
        ('excited', '🤩 Excited'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='journal_entries')
    title = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES, default='neutral')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Journal Entries'
    
    def __str__(self):
        return f"{self.title or 'Untitled'} - {self.created_at.strftime('%Y-%m-%d')}"
