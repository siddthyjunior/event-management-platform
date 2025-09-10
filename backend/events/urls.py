from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, RegistrationViewSet, SkillViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'registrations', RegistrationViewSet)
router.register(r'skills', SkillViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
