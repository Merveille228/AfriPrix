/* Magasins & services de référence au Togo  toutes régions */
export const TOGO_STORES = [

  //  RÉGION MARITIME 

  //  LOMÉ  Supermarchés 
  { name: 'Orca Dépôt Lomé',          city: 'Lomé', quartier: 'Bd du 13 Janvier', type: 'Supermarché',  lat: 6.1628, lng: 1.2227 },
  { name: 'Super Nana',               city: 'Lomé', quartier: 'Tokoin',           type: 'Supermarché',  lat: 6.1455, lng: 1.2139 },
  { name: 'Score Supermarché',        city: 'Lomé', quartier: 'Agbálépédogan',    type: 'Supermarché',  lat: 6.1416, lng: 1.2235 },
  { name: 'Neptune Supermarché',      city: 'Lomé', quartier: 'Nyékonakpoè',      type: 'Supermarché',  lat: 6.1442, lng: 1.2101 },
  { name: 'Leader Price Togo',        city: 'Lomé', quartier: 'Hédzranawoé',      type: 'Supermarché',  lat: 6.1353, lng: 1.2285 },

  //  LOMÉ  Marchés 
  { name: 'Grand Marché de Lomé',     city: 'Lomé', quartier: 'Centre-ville',     type: 'Marché',       lat: 6.1306, lng: 1.2186 },
  { name: "Marché d'Adidogomé",       city: 'Lomé', quartier: 'Adidogomé',        type: 'Marché',       lat: 6.1663, lng: 1.1782 },
  { name: "Marché d'Hédjranawoe",     city: 'Lomé', quartier: 'Hédzranawoé',      type: 'Marché',       lat: 6.1350, lng: 1.2297 },
  { name: "Marché d'Agoè",            city: 'Lomé', quartier: 'Agoè',             type: 'Marché',       lat: 6.1850, lng: 1.1986 },
  { name: 'Marché de Bè',             city: 'Lomé', quartier: 'Bè Kpota',         type: 'Marché',       lat: 6.1390, lng: 1.2447 },
  { name: 'Marché Djidjolé',          city: 'Lomé', quartier: 'Djidjolé',         type: 'Marché',       lat: 6.1540, lng: 1.2060 },
  { name: 'Marché de Dékon',          city: 'Lomé', quartier: 'Dékon',            type: 'Marché',       lat: 6.1730, lng: 1.2120 },
  { name: "Marché d'Akodésséwa",      city: 'Lomé', quartier: 'Akodésséwa',       type: 'Marché',       lat: 6.1405, lng: 1.2510 },
  { name: 'Marché de Cacavéli',       city: 'Lomé', quartier: 'Cacavéli',         type: 'Marché',       lat: 6.1756, lng: 1.2050 },

  //  LOMÉ  Pharmacies 
  { name: 'Pharmacie du Boulevard',   city: 'Lomé', quartier: 'Bd du 13 Janvier', type: 'Pharmacie',    lat: 6.1380, lng: 1.2200 },
  { name: 'Pharmacie Centrale',       city: 'Lomé', quartier: 'Centre-ville',     type: 'Pharmacie',    lat: 6.1340, lng: 1.2165 },
  { name: 'Pharmacie de Bè',          city: 'Lomé', quartier: 'Bè',               type: 'Pharmacie',    lat: 6.1420, lng: 1.2440 },
  { name: 'Pharmacie du Port',        city: 'Lomé', quartier: 'Hédzranawoé',      type: 'Pharmacie',    lat: 6.1360, lng: 1.2140 },
  { name: 'Pharmacie de la Paix',     city: 'Lomé', quartier: 'Centre-ville',     type: 'Pharmacie',    lat: 6.1355, lng: 1.2210 },
  { name: 'Pharmacie Tokoin',         city: 'Lomé', quartier: 'Tokoin',           type: 'Pharmacie',    lat: 6.1470, lng: 1.2150 },
  { name: 'Pharmacie Djidjolé',       city: 'Lomé', quartier: 'Djidjolé',         type: 'Pharmacie',    lat: 6.1545, lng: 1.2065 },
  { name: 'Pharmacie Adidogomé',      city: 'Lomé', quartier: 'Adidogomé',        type: 'Pharmacie',    lat: 6.1670, lng: 1.1800 },

  //  LOMÉ  Hôpitaux 
  { name: 'CHU Sylvanus Olympio',     city: 'Lomé', quartier: 'Centre-ville',     type: 'Hôpital',      lat: 6.1367, lng: 1.2219 },
  { name: 'CHU Campus (UL)',          city: 'Lomé', quartier: 'Tokoin',           type: 'Hôpital',      lat: 6.1612, lng: 1.2133 },
  { name: 'Hôpital de Bè',           city: 'Lomé', quartier: 'Bè',               type: 'Hôpital',      lat: 6.1450, lng: 1.2433 },

  //  LOMÉ  Tech / E-commerce 
  { name: 'Jumia Pickup Lomé',        city: 'Lomé', quartier: 'Tokoin',           type: 'E-commerce',   lat: 6.1480, lng: 1.2175 },
  { name: 'Boutique Mobile Plus',     city: 'Lomé', quartier: 'Ablogamé',         type: 'Électronique', lat: 6.1502, lng: 1.2083 },
  { name: 'Togocel Shop Centre',      city: 'Lomé', quartier: 'Centre-ville',     type: 'Électronique', lat: 6.1360, lng: 1.2195 },

  //  TSÉVIÉ 
  { name: 'Grand Marché de Tsévié',   city: 'Tsévié',   quartier: 'Centre',       type: 'Marché',       lat: 6.4268, lng: 1.2148 },
  { name: 'Pharmacie Tsévié',         city: 'Tsévié',   quartier: 'Centre',       type: 'Pharmacie',    lat: 6.4280, lng: 1.2160 },
  { name: 'CHR de Tsévié',            city: 'Tsévié',   quartier: 'Centre',       type: 'Hôpital',      lat: 6.4255, lng: 1.2130 },

  //  ANÉHO 
  { name: "Grand Marché d'Aného",     city: 'Aného',    quartier: 'Centre',       type: 'Marché',       lat: 6.2340, lng: 1.5950 },
  { name: 'Pharmacie Aného',          city: 'Aného',    quartier: 'Centre',       type: 'Pharmacie',    lat: 6.2350, lng: 1.5960 },

  //  VOGAN 
  { name: 'Marché de Vogan',          city: 'Vogan',    quartier: 'Centre',       type: 'Marché',       lat: 6.3167, lng: 1.5333 },

  //  TABLIGBO 
  { name: 'Marché de Tabligbo',       city: 'Tabligbo', quartier: 'Centre',       type: 'Marché',       lat: 6.5667, lng: 1.5000 },
  { name: 'Pharmacie Tabligbo',       city: 'Tabligbo', quartier: 'Centre',       type: 'Pharmacie',    lat: 6.5680, lng: 1.5015 },

  //  RÉGION DES PLATEAUX 

  //  NOTSÉ 
  { name: 'Marché de Notsé',          city: 'Notsé',    quartier: 'Centre',       type: 'Marché',       lat: 6.9500, lng: 1.1833 },
  { name: 'Pharmacie Notsé',          city: 'Notsé',    quartier: 'Centre',       type: 'Pharmacie',    lat: 6.9510, lng: 1.1845 },

  //  KPALIMÉ 
  { name: 'Grand Marché de Kpalimé',  city: 'Kpalimé',  quartier: 'Centre',       type: 'Marché',       lat: 6.8999, lng: 0.6239 },
  { name: 'Marché de Kpélé-Tutu',    city: 'Kpalimé',  quartier: 'Kpélé-Tutu',   type: 'Marché',       lat: 6.9120, lng: 0.6310 },
  { name: 'Pharmacie Kpalimé',        city: 'Kpalimé',  quartier: 'Centre',       type: 'Pharmacie',    lat: 6.9010, lng: 0.6250 },
  { name: 'CHR de Kpalimé',           city: 'Kpalimé',  quartier: 'Centre',       type: 'Hôpital',      lat: 6.9020, lng: 0.6220 },

  //  ATAKPAMÉ 
  { name: "Grand Marché d'Atakpamé",  city: 'Atakpamé', quartier: 'Centre',       type: 'Marché',       lat: 7.5333, lng: 1.1333 },
  { name: 'Marché de Kougnohou',      city: 'Atakpamé', quartier: 'Kougnohou',    type: 'Marché',       lat: 7.5290, lng: 1.1280 },
  { name: 'Pharmacie Atakpamé',       city: 'Atakpamé', quartier: 'Centre',       type: 'Pharmacie',    lat: 7.5350, lng: 1.1360 },
  { name: 'CHR Atakpamé',             city: 'Atakpamé', quartier: 'Centre',       type: 'Hôpital',      lat: 7.5360, lng: 1.1340 },

  //  BADOU 
  { name: 'Marché de Badou',          city: 'Badou',    quartier: 'Centre',       type: 'Marché',       lat: 7.5843, lng: 0.5897 },
  { name: 'Pharmacie Badou',          city: 'Badou',    quartier: 'Centre',       type: 'Pharmacie',    lat: 7.5850, lng: 0.5910 },

  //  RÉGION CENTRALE 

  //  SOKODÉ 
  { name: 'Grand Marché de Sokodé',   city: 'Sokodé',   quartier: 'Centre',       type: 'Marché',       lat: 8.9833, lng: 1.1333 },
  { name: 'Marché Central Sokodé',    city: 'Sokodé',   quartier: 'Centrale',     type: 'Marché',       lat: 8.9850, lng: 1.1350 },
  { name: 'Pharmacie Sokodé',         city: 'Sokodé',   quartier: 'Centre',       type: 'Pharmacie',    lat: 8.9820, lng: 1.1310 },
  { name: 'CHR de Sokodé',            city: 'Sokodé',   quartier: 'Centre',       type: 'Hôpital',      lat: 8.9860, lng: 1.1290 },

  //  SOTOUBOUA 
  { name: 'Marché de Sotouboua',      city: 'Sotouboua', quartier: 'Centre',      type: 'Marché',       lat: 8.5667, lng: 0.9833 },
  { name: 'Pharmacie Sotouboua',      city: 'Sotouboua', quartier: 'Centre',      type: 'Pharmacie',    lat: 8.5680, lng: 0.9845 },

  //  TCHAMBA 
  { name: 'Marché de Tchamba',        city: 'Tchamba',  quartier: 'Centre',       type: 'Marché',       lat: 9.0333, lng: 1.4333 },

  //  RÉGION DE LA KARA 

  //  KARA 
  { name: 'Grand Marché de Kara',     city: 'Kara',     quartier: 'Centre Kara',  type: 'Marché',       lat: 9.5519, lng: 1.1820 },
  { name: 'Supermarché Kara',         city: 'Kara',     quartier: 'Kara centre',  type: 'Supermarché',  lat: 9.5540, lng: 1.1870 },
  { name: 'Marché de Lama-Kara',      city: 'Kara',     quartier: 'Lama-Kara',    type: 'Marché',       lat: 9.5480, lng: 1.1790 },
  { name: 'Pharmacie de Kara',        city: 'Kara',     quartier: 'Kara centre',  type: 'Pharmacie',    lat: 9.5510, lng: 1.1840 },
  { name: 'CHR de Kara',              city: 'Kara',     quartier: 'Centre',       type: 'Hôpital',      lat: 9.5530, lng: 1.1800 },

  //  BASSAR 
  { name: 'Marché de Bassar',         city: 'Bassar',   quartier: 'Centre',       type: 'Marché',       lat: 9.2500, lng: 0.7833 },
  { name: 'Pharmacie Bassar',         city: 'Bassar',   quartier: 'Centre',       type: 'Pharmacie',    lat: 9.2510, lng: 0.7845 },

  //  BAFILO 
  { name: 'Marché de Bafilo',         city: 'Bafilo',   quartier: 'Centre',       type: 'Marché',       lat: 9.3500, lng: 1.2667 },

  //  RÉGION DES SAVANES 

  //  DAPAONG 
  { name: 'Grand Marché de Dapaong',  city: 'Dapaong',  quartier: 'Centre',       type: 'Marché',       lat: 10.8667, lng: 0.2000 },
  { name: 'Pharmacie Dapaong',        city: 'Dapaong',  quartier: 'Centre',       type: 'Pharmacie',    lat: 10.8680, lng: 0.2015 },
  { name: 'CHR de Dapaong',           city: 'Dapaong',  quartier: 'Centre',       type: 'Hôpital',      lat: 10.8650, lng: 0.1985 },

  //  MANGO 
  { name: 'Marché de Mango',          city: 'Mango',    quartier: 'Centre',       type: 'Marché',       lat: 10.3594, lng: 0.4697 },
  { name: 'Pharmacie Mango',          city: 'Mango',    quartier: 'Centre',       type: 'Pharmacie',    lat: 10.3600, lng: 0.4710 },
]