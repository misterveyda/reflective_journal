"""
Serializers for the journal app.
"""
from rest_framework import serializers
from .models import JournalEntry


class JournalEntrySerializer(serializers.ModelSerializer):
    """Serializer for JournalEntry model."""
    
    class Meta:
        model = JournalEntry
        fields = ['id', 'title', 'content', 'mood', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
