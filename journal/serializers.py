from rest_framework import serializers
from .models import JournalEntry, JournalSummary


class JournalEntrySerializer(serializers.ModelSerializer):
    """Serializer for JournalEntry model."""
    
    class Meta:
        model = JournalEntry
        fields = ['id', 'title', 'content', 'summary', 'mood', 'tags', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class JournalSummarySerializer(serializers.ModelSerializer):
    """Serializer for JournalSummary model."""
    
    class Meta:
        model = JournalSummary
        fields = ['id', 'period', 'summary_text', 'start_date', 'end_date', 'created_at']
        read_only_fields = ['id', 'created_at']
