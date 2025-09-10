from django.contrib import admin
from .models import Event, Registration, Skill

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "date", "organizer")
    search_fields = ("title", "description")
    list_filter = ("date",)

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ("user", "event", "timestamp")
    search_fields = ("user__username", "event__title")

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("user", "name")
    search_fields = ("user__username", "name")

