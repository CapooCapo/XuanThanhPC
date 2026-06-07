from django.contrib import admin
from .models import ChatSession, ChatMessage

class ChatMessageInline(admin.TabularInline):
    model = ChatMessage
    extra = 0
    readonly_fields = ('sender', 'content', 'timestamp')

@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ('session_id', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('session_id',)
    readonly_fields = ('session_id', 'created_at')
    inlines = [ChatMessageInline]
