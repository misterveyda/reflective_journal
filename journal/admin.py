from django.contrib import admin
from .models import JournalEntry, JournalSummary


@admin.register(JournalEntry)
class JournalEntryAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'mood', 'created_at', 'updated_at')
    list_filter = ('mood', 'created_at', 'user')
    search_fields = ('title', 'content', 'tags')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Content', {
            'fields': ('user', 'title', 'content', 'summary')
        }),
        ('Metadata', {
            'fields': ('mood', 'tags')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(JournalSummary)
class JournalSummaryAdmin(admin.ModelAdmin):
    list_display = ('user', 'period', 'end_date', 'created_at')
    list_filter = ('period', 'created_at', 'user')
    readonly_fields = ('created_at',)
