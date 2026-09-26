/**
 * Official List and Geographic Metadata of States and Union Territories in the Republic of India
 * Sourced from Ministry of Home Affairs (MHA), Ministry of Tribal Affairs (MoTA) & Government of India Portal.
 * 28 States + 8 Union Territories = 36 Total Administrative Units
 */

export interface StateRecord {
  name: string;
  code: string;
  zone: 'North' | 'South' | 'East' | 'West' | 'Central' | 'North-East' | 'Union Territory';
  primaryTribes: string[];
  capital: string;
  districts: string[];
}

export const INDIAN_STATES: string[] = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const INDIAN_UNION_TERRITORIES: string[] = [
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export const ALL_INDIAN_STATES_AND_UTS: string[] = [
  ...INDIAN_STATES,
  ...INDIAN_UNION_TERRITORIES,
].sort((a, b) => a.localeCompare(b));

export const INDIAN_ADMINISTRATIVE_DIVISIONS = [
  {
    group: 'States (28)',
    items: INDIAN_STATES,
  },
  {
    group: 'Union Territories (8)',
    items: INDIAN_UNION_TERRITORIES,
  },
];

/**
 * Master Registry of all 36 States and Union Territories with Article 342 Tribal Communities
 */
export const MASTER_36_INDIAN_STATES: StateRecord[] = [
  // 1. Telangana
  {
    name: 'Telangana',
    code: 'TG',
    zone: 'South',
    capital: 'Hyderabad',
    primaryTribes: ['Gond', 'Koya', 'Chenchu (PVTG)', 'Lambada', 'Kolam (PVTG)', 'Thoti'],
    districts: ['Adilabad', 'Kumuram Bheem Asifabad', 'Bhadradri Kothagudem', 'Nagarkurnool', 'Khammam'],
  },
  // 2. Jharkhand
  {
    name: 'Jharkhand',
    code: 'JH',
    zone: 'East',
    capital: 'Ranchi',
    primaryTribes: ['Santhal', 'Munda', 'Oraon', 'Ho', 'Birhor (PVTG)', 'Kharia'],
    districts: ['Khunti (Birsa Munda Land)', 'Ranchi', 'Dumka', 'West Singhbhum', 'Simdega'],
  },
  // 3. Odisha
  {
    name: 'Odisha',
    code: 'OD',
    zone: 'East',
    capital: 'Bhubaneswar',
    primaryTribes: ['Kandha', 'Santhal', 'Saura', 'Bonda (PVTG)', 'Dongria Kondh (PVTG)', 'Munda'],
    districts: ['Mayurbhanj', 'Koraput', 'Rayagada', 'Malkangiri', 'Sundargarh'],
  },
  // 4. Chhattisgarh
  {
    name: 'Chhattisgarh',
    code: 'CG',
    zone: 'Central',
    capital: 'Raipur',
    primaryTribes: ['Gond', 'Maria Gond', 'Halba', 'Bhatra', 'Abujhmarhia (PVTG)', 'Baiga (PVTG)'],
    districts: ['Bastar (Jagdalpur)', 'Dantewada', 'Kanker', 'Narayanpur', 'Surguja'],
  },
  // 5. Madhya Pradesh
  {
    name: 'Madhya Pradesh',
    code: 'MP',
    zone: 'Central',
    capital: 'Bhopal',
    primaryTribes: ['Bhil', 'Gond', 'Baiga (PVTG)', 'Sahariya (PVTG)', 'Korku', 'Kol'],
    districts: ['Jhabua', 'Mandla', 'Dindori', 'Barwani', 'Alirajpur'],
  },
  // 6. Meghalaya
  {
    name: 'Meghalaya',
    code: 'ML',
    zone: 'North-East',
    capital: 'Shillong',
    primaryTribes: ['Khasi', 'Garo', 'Jaintia'],
    districts: ['East Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'Ri-Bhoi'],
  },
  // 7. Assam
  {
    name: 'Assam',
    code: 'AS',
    zone: 'North-East',
    capital: 'Dispur',
    primaryTribes: ['Bodo', 'Mishing', 'Karbi', 'Dimasa', 'Rabha', 'Sonowal Kachari'],
    districts: ['Kokrajhar (BTR)', 'Karbi Anglong', 'Dima Hasao', 'Baksa', 'Chirang'],
  },
  // 8. Andhra Pradesh
  {
    name: 'Andhra Pradesh',
    code: 'AP',
    zone: 'South',
    capital: 'Amaravati',
    primaryTribes: ['Chenchu (PVTG)', 'Yanadi', 'Yerukula', 'Konda Reddi (PVTG)', 'Sugali'],
    districts: ['Alluri Sitharama Raju (Paderu)', 'Parvathipuram Manyam', 'Prakasam (Nallamala)', 'East Godavari'],
  },
  // 9. Arunachal Pradesh
  {
    name: 'Arunachal Pradesh',
    code: 'AR',
    zone: 'North-East',
    capital: 'Itanagar',
    primaryTribes: ['Nyishi', 'Galo', 'Adi', 'Apatani', 'Monpa', 'Mishmi', 'Tagin'],
    districts: ['Papum Pare', 'West Kameng', 'Tawang', 'Lower Subansiri', 'Changlang'],
  },
  // 10. Bihar
  {
    name: 'Bihar',
    code: 'BR',
    zone: 'East',
    capital: 'Patna',
    primaryTribes: ['Santhal', 'Oraon', 'Munda', 'Gond', 'Kharwar', 'Chero'],
    districts: ['Jamui', 'Banka', 'West Champaran', 'Kaimur', 'Rohtas'],
  },
  // 11. Goa
  {
    name: 'Goa',
    code: 'GA',
    zone: 'West',
    capital: 'Panaji',
    primaryTribes: ['Gawda', 'Kunbi', 'Velip'],
    districts: ['South Goa (Canacona/Quepem)', 'North Goa (Sattari)'],
  },
  // 12. Gujarat
  {
    name: 'Gujarat',
    code: 'GJ',
    zone: 'West',
    capital: 'Gandhinagar',
    primaryTribes: ['Bhil', 'Dhodia', 'Dubla', 'Rathawa', 'Chaudhri', 'Gamit'],
    districts: ['Dangs (Ahwa)', 'Dahod', 'Panchmahal', 'Chhota Udaipur', 'Narmada'],
  },
  // 13. Haryana
  {
    name: 'Haryana',
    code: 'HR',
    zone: 'North',
    capital: 'Chandigarh',
    primaryTribes: ['Notified ST Nomadic & Migrant Registries'],
    districts: ['Ambala', 'Gurugram', 'Faridabad', 'Hisar'],
  },
  // 14. Himachal Pradesh
  {
    name: 'Himachal Pradesh',
    code: 'HP',
    zone: 'North',
    capital: 'Shimla',
    primaryTribes: ['Gaddi', 'Gujjar', 'Kinnaura', 'Lahaula', 'Pangwala', 'Bhot'],
    districts: ['Kinnaur', 'Lahaul and Spiti', 'Chamba (Bharmour)', 'Kangra'],
  },
  // 15. Karnataka
  {
    name: 'Karnataka',
    code: 'KA',
    zone: 'South',
    capital: 'Bengaluru',
    primaryTribes: ['Naikda', 'Kadu Kuruba', 'Jenu Kuruba (PVTG)', 'Soliga', 'Yerava', 'Koraga (PVTG)'],
    districts: ['Mysuru (Hunsur)', 'Chamarajanagar', 'Kodagu', 'Uttara Kannada', 'Udupi'],
  },
  // 16. Kerala
  {
    name: 'Kerala',
    code: 'KL',
    zone: 'South',
    capital: 'Thiruvananthapuram',
    primaryTribes: ['Paniyan', 'Kurumba (PVTG)', 'Kattunayakan (PVTG)', 'Kadar (PVTG)', 'Irular'],
    districts: ['Wayanad (Kalpetta)', 'Palakkad (Attappadi)', 'Idukki', 'Kasaragod'],
  },
  // 17. Maharashtra
  {
    name: 'Maharashtra',
    code: 'MH',
    zone: 'West',
    capital: 'Mumbai',
    primaryTribes: ['Bhil', 'Gond', 'Warli', 'Katkari (PVTG)', 'Madia Gond (PVTG)', 'Kolam (PVTG)'],
    districts: ['Gadchiroli', 'Palghar', 'Nandurbar', 'Nashik', 'Dhule', 'Chandrapur'],
  },
  // 18. Manipur
  {
    name: 'Manipur',
    code: 'MN',
    zone: 'North-East',
    capital: 'Imphal',
    primaryTribes: ['Tangkhul', 'Kuki', 'Paite', 'Hmar', 'Mao', 'Maram', 'Rongmei'],
    districts: ['Churachandpur', 'Ukhrul', 'Senapati', 'Tamenglong', 'Chandel'],
  },
  // 19. Mizoram
  {
    name: 'Mizoram',
    code: 'MZ',
    zone: 'North-East',
    capital: 'Aizawl',
    primaryTribes: ['Mizo', 'Lushai', 'Chakma', 'Mara', 'Lai', 'Pawi'],
    districts: ['Aizawl', 'Lunglei', 'Champhai', 'Lawngtlai', 'Siaha'],
  },
  // 20. Nagaland
  {
    name: 'Nagaland',
    code: 'NL',
    zone: 'North-East',
    capital: 'Kohima',
    primaryTribes: ['Ao', 'Angami', 'Sema (Sumi)', 'Lotha', 'Konyak', 'Rengma', 'Chakhesang'],
    districts: ['Kohima', 'Mokokchung', 'Dimapur', 'Mon', 'Tuensang', 'Wokha'],
  },
  // 21. Punjab
  {
    name: 'Punjab',
    code: 'PB',
    zone: 'North',
    capital: 'Chandigarh',
    primaryTribes: ['Special Nomadic Registries & Semi-Nomadic Tribes'],
    districts: ['Firozpur', 'Gurdaspur', 'Amritsar', 'Ludhiana'],
  },
  // 22. Rajasthan
  {
    name: 'Rajasthan',
    code: 'RJ',
    zone: 'West',
    capital: 'Jaipur',
    primaryTribes: ['Meena', 'Bhil', 'Garasia', 'Sahariya (PVTG)', 'Damor'],
    districts: ['Banswara', 'Dungarpur', 'Udaipur', 'Pratapgarh', 'Baran (Kishanganj)'],
  },
  // 23. Sikkim
  {
    name: 'Sikkim',
    code: 'SK',
    zone: 'North-East',
    capital: 'Gangtok',
    primaryTribes: ['Bhutia', 'Lepcha', 'Limbu', 'Tamang'],
    districts: ['Mangan (North Sikkim)', 'Gyalshing (West Sikkim)', 'Gangtok', 'Namchi'],
  },
  // 24. Tamil Nadu
  {
    name: 'Tamil Nadu',
    code: 'TN',
    zone: 'South',
    capital: 'Chennai',
    primaryTribes: ['Toda (PVTG)', 'Kota (PVTG)', 'Irula', 'Kurumba (PVTG)', 'Malayali', 'Paniyan'],
    districts: ['The Nilgiris (Ooty)', 'Salem (Kolli Hills)', 'Tiruvannamalai (Jawadhu Hills)', 'Namakkal'],
  },
  // 25. Tripura
  {
    name: 'Tripura',
    code: 'TR',
    zone: 'North-East',
    capital: 'Agartala',
    primaryTribes: ['Tripuri', 'Reang/Bru (PVTG)', 'Jamatia', 'Chakma', 'Halam', 'Mogh'],
    districts: ['Dhalai (Ambassa)', 'West Tripura', 'Gomati', 'South Tripura', 'Khowai'],
  },
  // 26. Uttar Pradesh
  {
    name: 'Uttar Pradesh',
    code: 'UP',
    zone: 'North',
    capital: 'Lucknow',
    primaryTribes: ['Tharu', 'Buxa (PVTG)', 'Gond', 'Kharwar', 'Sahariya', 'Chero'],
    districts: ['Sonbhadra', 'Lakhimpur Kheri', 'Balrampur', 'Chandauli', 'Varanasi'],
  },
  // 27. Uttarakhand
  {
    name: 'Uttarakhand',
    code: 'UK',
    zone: 'North',
    capital: 'Dehradun',
    primaryTribes: ['Tharu', 'Bhotia', 'Jaunsari', 'Buksa (PVTG)', 'Raji (PVTG)'],
    districts: ['Dehradun (Chakrata)', 'Pithoragarh', 'Chamoli', 'Udham Singh Nagar'],
  },
  // 28. West Bengal
  {
    name: 'West Bengal',
    code: 'WB',
    zone: 'East',
    capital: 'Kolkata',
    primaryTribes: ['Santhal', 'Oraon', 'Munda', 'Bhumij', 'Mech', 'Toto (PVTG)', 'Lodha (PVTG)'],
    districts: ['Purulia', 'Jhargram', 'Bankura', 'Paschim Medinipur', 'Alipurduar'],
  },
  // 29. Andaman and Nicobar Islands
  {
    name: 'Andaman and Nicobar Islands',
    code: 'AN',
    zone: 'Union Territory',
    capital: 'Port Blair',
    primaryTribes: ['Sentinelese (PVTG)', 'Jarawa (PVTG)', 'Onge (PVTG)', 'Great Andamanese', 'Nicobarese', 'Shompen (PVTG)'],
    districts: ['South Andaman', 'Nicobar (Car Nicobar)', 'North and Middle Andaman'],
  },
  // 30. Chandigarh
  {
    name: 'Chandigarh',
    code: 'CH',
    zone: 'Union Territory',
    capital: 'Chandigarh',
    primaryTribes: ['Northern UT Administrative Registry'],
    districts: ['Chandigarh Urban'],
  },
  // 31. Dadra and Nagar Haveli and Daman and Diu
  {
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    code: 'DH',
    zone: 'Union Territory',
    capital: 'Daman',
    primaryTribes: ['Varli', 'Dhodia', 'Dubla', 'Kokna', 'Naikda'],
    districts: ['Dadra and Nagar Haveli (Silvassa)', 'Daman', 'Diu'],
  },
  // 32. Delhi (NCT)
  {
    name: 'Delhi (NCT)',
    code: 'DL',
    zone: 'Union Territory',
    capital: 'New Delhi',
    primaryTribes: ['National Capital Scheduled Tribe Scholars Cohort'],
    districts: ['Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi'],
  },
  // 33. Jammu and Kashmir
  {
    name: 'Jammu and Kashmir',
    code: 'JK',
    zone: 'Union Territory',
    capital: 'Srinagar / Jammu',
    primaryTribes: ['Gujjar', 'Bakarwal', 'Gaddi', 'Sippi'],
    districts: ['Rajouri', 'Poonch', 'Anantnag', 'Kupwara', 'Baramulla'],
  },
  // 34. Ladakh
  {
    name: 'Ladakh',
    code: 'LA',
    zone: 'Union Territory',
    capital: 'Leh',
    primaryTribes: ['Balti', 'Beda', 'Bot/Boto', 'Brokpa/Drokpa', 'Changpa', 'Garra', 'Mon', 'Purigpa'],
    districts: ['Leh', 'Kargil', 'Zanskar', 'Nubra'],
  },
  // 35. Lakshadweep
  {
    name: 'Lakshadweep',
    code: 'LD',
    zone: 'Union Territory',
    capital: 'Kavaratti',
    primaryTribes: ['Aminidivi', 'Koyas', 'Malmis', 'Melacheris'],
    districts: ['Kavaratti Island', 'Agatti', 'Minicoy', 'Amini'],
  },
  // 36. Puducherry
  {
    name: 'Puducherry',
    code: 'PY',
    zone: 'Union Territory',
    capital: 'Puducherry',
    primaryTribes: ['Southern UT Coastal ST Registry'],
    districts: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
  },
];
