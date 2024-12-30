import csv
from django.core.management.base import BaseCommand
from utils.models import City


class Command(BaseCommand):
    help = 'Load cities from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')

    def handle(self, *args, **kwargs):
        file_path = kwargs['csv_file']

        try:
            with open(file_path, 'r') as csvfile:
                reader = csv.DictReader(csvfile)
                missing_columns = [col for col in ['city', 'country'] if col not in reader.fieldnames]
                if missing_columns:
                    self.stdout.write(self.style.ERROR(f'Missing columns: {", ".join(missing_columns)}'))
                    return

                for row in reader:
                    city_name = row['city'].strip()
                    country_name = row['country'].strip()

                    City.objects.get_or_create(country=country_name, name=city_name)

            self.stdout.write(self.style.SUCCESS(f'Successfully loaded cities from {file_path}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {e}'))
