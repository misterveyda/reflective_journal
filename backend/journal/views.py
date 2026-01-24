"""
Views for the journal app.
"""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import JournalEntry
from .serializers import JournalEntrySerializer


class JournalEntryViewSet(viewsets.ModelViewSet):
    """ViewSet for managing journal entries."""
    
    serializer_class = JournalEntrySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return entries for the current user only."""
        return JournalEntry.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Associate the entry with the current user."""
        serializer.save(user=self.request.user)
