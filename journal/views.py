from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta, datetime
from .models import JournalEntry, JournalSummary
from .serializers import JournalEntrySerializer, JournalSummarySerializer
from .summarizer import summarize_entries, extract_themes


class JournalEntryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CRUD operations on journal entries.
    Supports filtering and searching.
    """
    serializer_class = JournalEntrySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'tags']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Return only the entries for the current user."""
        return JournalEntry.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Associate the entry with the current user."""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent journal entries (last 7 days)."""
        seven_days_ago = timezone.now() - timedelta(days=7)
        entries = JournalEntry.objects.filter(
            user=request.user,
            created_at__gte=seven_days_ago
        )
        serializer = self.get_serializer(entries, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def summarize(self, request):
        """Generate a summary of entries from a specific date range."""
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        
        if not start_date or not end_date:
            return Response(
                {'error': 'start_date and end_date are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            start = datetime.fromisoformat(start_date).date()
            end = datetime.fromisoformat(end_date).date()
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        entries = JournalEntry.objects.filter(
            user=request.user,
            created_at__date__range=[start, end]
        )
        
        if not entries.exists():
            return Response({
                'summary': 'No entries found for this date range.',
                'themes': {'entry_count': 0}
            })
        
        summary_text = summarize_entries(list(entries))
        themes = extract_themes(list(entries))
        
        # Save the summary to database
        period = 'daily' if (end - start).days == 0 else 'weekly' if (end - start).days <= 7 else 'monthly'
        summary_obj = JournalSummary.objects.create(
            user=request.user,
            period=period,
            summary_text=summary_text,
            start_date=start,
            end_date=end
        )
        
        return Response({
            'id': summary_obj.id,
            'summary': summary_text,
            'themes': themes,
            'period': period,
            'start_date': start,
            'end_date': end
        })
