from django.urls import path
from . import views

urlpatterns = [
    path("", views.preferences, name="preferences"),
    path("sources/", views.list_sources, name="sources-list"),
    path("sources/<str:source>/toggle/", views.toggle_source, name="source-toggle"),
]
