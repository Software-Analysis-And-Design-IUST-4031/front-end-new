interface CountryType {
  code: string;
  label: string;
  cities: string[];
}

export const countries: CountryType[] = [
  {
    code: 'IR',
    label: 'Iran',
    cities: ['Tehran', 'Isfahan', 'Shiraz', 'Mashhad', 'Tabriz', 'Yazd', 'Kerman', 'Rasht', 'Ahvaz', 'Qom']
  },
  {
    code: 'US',
    label: 'United States',
    cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose']
  },
  {
    code: 'GB',
    label: 'United Kingdom',
    cities: ['London', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield', 'Manchester', 'Edinburgh', 'Liverpool', 'Bristol', 'Cardiff']
  },
  {
    code: 'FR',
    label: 'France',
    cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille']
  },
  {
    code: 'DE',
    label: 'Germany',
    cities: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen']
  },
  {
    code: 'IT',
    label: 'Italy',
    cities: ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Venice', 'Verona']
  },
  {
    code: 'ES',
    label: 'Spain',
    cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Bilbao', 'Alicante']
  },
  {
    code: 'CA',
    label: 'Canada',
    cities: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Quebec City', 'Winnipeg', 'Hamilton', 'Halifax']
  },
  {
    code: 'AU',
    label: 'Australia',
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Newcastle', 'Wollongong', 'Logan City']
  },
  {
    code: 'JP',
    label: 'Japan',
    cities: ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto', 'Kawasaki', 'Saitama']
  }
];

export const findCountryByLabel = (label: string): CountryType | undefined => {
  return countries.find(country => country.label === label);
};

export const getCitiesForCountry = (countryLabel: string): string[] => {
  const country = findCountryByLabel(countryLabel);
  return country?.cities || [];
};
