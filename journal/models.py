from django.db import models
from django.contrib.auth.models import User


class JournalEntry(models.Model):
    """Model for journal entries with reflection and summary features."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='journal_entries')
    title = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    summary = models.TextField(blank=True, null=True)
    mood = models.CharField(
        max_length=20,
        choices=[
            ('very_positive', 'Very Positive'),
            ('positive', 'Positive'),
            ('neutral', 'Neutral'),
            ('negative', 'Negative'),
            ('very_negative', 'Very Negative'),
        ],
        blank=True
    )
    tags = models.CharField(max_length=255, blank=True, help_text="Comma-separated tags")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Journal Entries'
    
    def __str__(self):
        return f"{self.title or 'Untitled'} - {self.created_at.strftime('%Y-%m-%d')}"


class JournalSummary(models.Model):
    """Model for storing periodic summaries of journal entries."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='journal_summaries')
    period = models.CharField(
        max_length=20,
        choices=[
            ('daily', 'Daily'),
            ('weekly', 'Weekly'),
            ('monthly', 'Monthly'),
        ]
    )
    summary_text = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-end_date']
    
    def __str__(self):
        return f"{self.get_period_display()} Summary - {self.end_date}"
