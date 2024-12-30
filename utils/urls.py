from django.urls import path
from .views import GetCountriesView, GetCitiesByCountryView, SaveUserSelectionView

urlpatterns = [
    path('countries/', GetCountriesView.as_view(), name='get_countries'),
    path('cities/<str:country_name>/', GetCitiesByCountryView.as_view(), name='get_cities_by_country'),
    path('save-user-selection/', SaveUserSelectionView.as_view(), name='save_user_selection'),
]
