from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from journal.views import JournalEntryViewSet

router = DefaultRouter()
router.register(r'entries', JournalEntryViewSet, basename='entry')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/', include(router.urls)),
]
