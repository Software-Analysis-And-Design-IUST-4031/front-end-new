# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import City, UserSelection
from .serializers import UserSelectionSerializer


class GetCountriesView(APIView):
    def get(self, request):
        countries = City.objects.values_list('country', flat=True).distinct()
        return Response(list(countries))


class GetCitiesByCountryView(APIView):
    def get(self, request, country_name):
        cities = City.objects.filter(country=country_name).values_list('name', flat=True)
        if not cities.exists():
            return Response({"error": "No cities found for this country."}, status=404)
        return Response(list(cities))


class SaveUserSelectionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = UserSelectionSerializer(data=request.data)

        if serializer.is_valid():
            user = request.user
            country = serializer.validated_data['country']
            city = serializer.validated_data['city']

            
            UserSelection.objects.update_or_create(
                user=user,
                defaults={'country': country, 'city': city}
            )

            return Response({'message': 'Selection saved successfully.'})

        return Response({'error': serializer.errors}, status=400)


class GetUserSelectionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            selection = UserSelection.objects.get(user=request.user)
            return Response({
                'country': selection.country,
                'city': selection.city
            })
        except UserSelection.DoesNotExist:
            return Response({'error': 'No selection found for this user.'}, status=404)
