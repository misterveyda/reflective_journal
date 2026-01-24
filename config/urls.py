from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework.routers import DefaultRouter
from journal.views import JournalEntryViewSet

router = DefaultRouter()
router.register(r'entries', JournalEntryViewSet, basename='entry')

def api_root(request):
    return JsonResponse({
        'message': 'Reflective Journal API',
        'endpoints': {
            'admin': '/admin/',
            'auth': '/api/auth/',
            'registration': '/api/auth/registration/',
            'entries': '/api/entries/',
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/', include(router.urls)),
]
