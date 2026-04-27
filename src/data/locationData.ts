export type LocationData = {
  [country: string]: {
    [state: string]: string[];
  };
};

export type DialCode = { country: string; code: string; flag: string };

export const DIAL_CODES: DialCode[] = [
  { country: 'United States', code: '+1', flag: '🇺🇸' },
  { country: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { country: 'Canada', code: '+1', flag: '🇨🇦' },
  { country: 'Australia', code: '+61', flag: '🇦🇺' },
  { country: 'India', code: '+91', flag: '🇮🇳' },
  { country: 'Germany', code: '+49', flag: '🇩🇪' },
  { country: 'France', code: '+33', flag: '🇫🇷' },
  { country: 'China', code: '+86', flag: '🇨🇳' },
  { country: 'Japan', code: '+81', flag: '🇯🇵' },
  { country: 'Brazil', code: '+55', flag: '🇧🇷' },
  { country: 'Mexico', code: '+52', flag: '🇲🇽' },
  { country: 'South Africa', code: '+27', flag: '🇿🇦' },
  { country: 'Nigeria', code: '+234', flag: '🇳🇬' },
  { country: 'UAE', code: '+971', flag: '🇦🇪' },
  { country: 'Saudi Arabia', code: '+966', flag: '🇸🇦' },
  { country: 'Pakistan', code: '+92', flag: '🇵🇰' },
  { country: 'Bangladesh', code: '+880', flag: '🇧🇩' },
  { country: 'Indonesia', code: '+62', flag: '🇮🇩' },
  { country: 'Philippines', code: '+63', flag: '🇵🇭' },
  { country: 'South Korea', code: '+82', flag: '🇰🇷' },
  { country: 'Italy', code: '+39', flag: '🇮🇹' },
  { country: 'Spain', code: '+34', flag: '🇪🇸' },
  { country: 'Netherlands', code: '+31', flag: '🇳🇱' },
  { country: 'Singapore', code: '+65', flag: '🇸🇬' },
  { country: 'New Zealand', code: '+64', flag: '🇳🇿' },
  { country: 'Ghana', code: '+233', flag: '🇬🇭' },
  { country: 'Kenya', code: '+254', flag: '🇰🇪' },
  { country: 'Egypt', code: '+20', flag: '🇪🇬' },
  { country: 'Turkey', code: '+90', flag: '🇹🇷' },
  { country: 'Russia', code: '+7', flag: '🇷🇺' },
];

export const LOCATION_DATA: LocationData = {
  'United States': {
    'Alabama': ['Birmingham', 'Montgomery', 'Huntsville', 'Mobile', 'Tuscaloosa'],
    'Alaska': ['Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Ketchikan'],
    'Arizona': ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale'],
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose'],
    'Colorado': ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Boulder'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
    'Georgia': ['Atlanta', 'Augusta', 'Columbus', 'Macon', 'Savannah'],
    'Illinois': ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford'],
    'Massachusetts': ['Boston', 'Worcester', 'Springfield', 'Lowell', 'Cambridge'],
    'Michigan': ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse'],
    'Nevada': ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks'],
    'New Jersey': ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Edison'],
    'North Carolina': ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem'],
    'Ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'],
    'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading'],
    'Texas': ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth'],
    'Virginia': ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Arlington'],
    'Washington': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue'],
  },
  'United Kingdom': {
    'England': ['London', 'Birmingham', 'Manchester', 'Leeds', 'Liverpool'],
    'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Inverness'],
    'Wales': ['Cardiff', 'Swansea', 'Newport', 'Bangor', 'Wrexham'],
    'Northern Ireland': ['Belfast', 'Derry', 'Lisburn', 'Newry', 'Armagh'],
  },
  'Canada': {
    'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat'],
    'British Columbia': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Kelowna'],
    'Manitoba': ['Winnipeg', 'Brandon', 'Steinbach', 'Thompson', 'Portage la Prairie'],
    'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Brampton', 'Hamilton'],
    'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil'],
    'Saskatchewan': ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Swift Current'],
    'Nova Scotia': ['Halifax', 'Cape Breton', 'Truro', 'New Glasgow', 'Amherst'],
  },
  'Australia': {
    'New South Wales': ['Sydney', 'Newcastle', 'Central Coast', 'Wollongong', 'Orange'],
    'Victoria': ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Shepparton'],
    'Queensland': ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Townsville', 'Cairns'],
    'Western Australia': ['Perth', 'Fremantle', 'Bunbury', 'Geraldton', 'Kalgoorlie'],
    'South Australia': ['Adelaide', 'Mount Gambier', 'Whyalla', 'Port Lincoln', 'Murray Bridge'],
    'Tasmania': ['Hobart', 'Launceston', 'Devonport', 'Burnie', 'Ulverstone'],
  },
  'India': {
    'Delhi': ['New Delhi', 'Dwarka', 'Rohini', 'Janakpuri', 'Pitampura'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    'Uttar Pradesh': ['Lucknow', 'Agra', 'Kanpur', 'Varanasi', 'Allahabad'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
  },
  'Pakistan': {
    'Punjab': ['Lahore', 'Faisalabad', 'Rawalpindi', 'Gujranwala', 'Multan'],
    'Sindh': ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah'],
    'Khyber Pakhtunkhwa': ['Peshawar', 'Mardan', 'Mingora', 'Kohat', 'Abbottabad'],
    'Balochistan': ['Quetta', 'Turbat', 'Khuzdar', 'Chaman', 'Gwadar'],
    'Islamabad Capital Territory': ['Islamabad'],
    'Azad Kashmir': ['Muzaffarabad', 'Mirpur', 'Rawalakot', 'Bagh', 'Kotli'],
  },
  'United Arab Emirates': {
    'Abu Dhabi': ['Abu Dhabi City', 'Al Ain', 'Ruwais', 'Madinat Zayed', 'Liwa'],
    'Dubai': ['Dubai City', 'Jebel Ali', 'Hatta'],
    'Sharjah': ['Sharjah City', 'Khor Fakkan', 'Kalba', 'Dhaid'],
    'Ajman': ['Ajman City', 'Masfut', 'Manama'],
    'Ras Al Khaimah': ['Ras Al Khaimah City', 'Khor Khwair', 'Digdagga'],
    'Fujairah': ['Fujairah City', 'Dibba Al-Fujairah', 'Khor Fakkan'],
    'Umm Al Quwain': ['Umm Al Quwain City', 'Falaj Al Mualla'],
  },
  'Germany': {
    'Bavaria': ['Munich', 'Nuremberg', 'Augsburg', 'Regensburg', 'Wurzburg'],
    'Berlin': ['Berlin'],
    'Brandenburg': ['Potsdam', 'Cottbus', 'Brandenburg an der Havel', 'Frankfurt (Oder)'],
    'Hamburg': ['Hamburg'],
    'North Rhine-Westphalia': ['Cologne', 'Dusseldorf', 'Dortmund', 'Essen', 'Bonn'],
    'Baden-Wurttemberg': ['Stuttgart', 'Mannheim', 'Karlsruhe', 'Freiburg', 'Heidelberg'],
    'Saxony': ['Dresden', 'Leipzig', 'Chemnitz', 'Zwickau', 'Plauen'],
  },
  'France': {
    'Île-de-France': ['Paris', 'Boulogne-Billancourt', 'Saint-Denis', 'Versailles', 'Nanterre'],
    'Auvergne-Rhône-Alpes': ['Lyon', 'Grenoble', 'Saint-Étienne', 'Clermont-Ferrand', 'Annecy'],
    'Nouvelle-Aquitaine': ['Bordeaux', 'Limoges', 'Poitiers', 'Angoulême', 'La Rochelle'],
    'Occitanie': ['Toulouse', 'Montpellier', 'Nîmes', 'Perpignan', 'Béziers'],
    'Provence-Alpes-Côte d\'Azur': ['Marseille', 'Nice', 'Toulon', 'Aix-en-Provence', 'Cannes'],
  },
};

export const COUNTRIES = Object.keys(LOCATION_DATA).sort();

export const getStates = (country: string): string[] =>
  country ? Object.keys(LOCATION_DATA[country] || {}).sort() : [];

export const getCities = (country: string, state: string): string[] =>
  country && state ? (LOCATION_DATA[country]?.[state] || []).sort() : [];
