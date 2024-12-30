import csv
from utils.models import Country, City

def populate_from_csv(csv_path):
    """
    Populate the database with cities and countries using ISO3 country codes.
    """
    try:
        with open(csv_path, "r") as csvfile:
            reader = csv.DictReader(csvfile)

            for row in reader:
                country_iso3 = row.get("iso3")  # Adjust to the correct column name (iso3)
                city_name = row.get("city")  # Get the city name

                # Skip the row if country_iso3 is missing
                if not country_iso3:
                    print(f"Skipping row with missing country_iso3: {row}")
                    continue

                # Attempt to get or create the country using iso3_code
                try:
                    country, created = Country.objects.get_or_create(iso3_code=country_iso3)
                except Exception as e:
                    print(f"Error creating country for {country_iso3}: {e}")
                    continue  # Skip this row if there’s an error creating the country

                # Add the city to the corresponding country
                City.objects.get_or_create(name=city_name, country=country)

        print("Database population from CSV complete!")
    except Exception as e:
        print(f"Error populating database: {e}")
