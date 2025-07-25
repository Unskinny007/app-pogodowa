export const popularPolishCities = [
  "Warszawa",
  "Kraków",
  "Gdańsk",
  "Wrocław",
  "Poznań",
  "Łódź",
  "Katowice",
  "Bydgoszcz",
  "Lublin",
  "Białystok",
  "Szczecin",
  "Olsztyn",
  "Rzeszów",
  "Toruń",
  "Kielce",
  "Gorzów Wielkopolski",
  "Opole",
  "Zielona Góra",
  "Częstochowa",
  "Radom",
  "Sosnowiec",
  "Tychy",
  "Gliwice",
  "Zabrze",
  "Bytom",
  "Ruda Śląska",
  "Rybnik",
  "Dąbrowa Górnicza",
  "Płock",
  "Elbląg",
  "Wałbrzych",
  "Włocławek",
  "Tarnów",
  "Chorzów",
  "Koszalin",
  "Kalisz",
  "Legnica",
  "Grudziądz",
  "Słupsk",
  "Jaworzno",
  "Jastrzębie-Zdrój",
  "Nowy Sącz",
  "Jelenia Góra",
  "Siedlce",
  "Mysłowice",
  "Konin",
  "Piła",
  "Inowrocław",
  "Lubin",
  "Ostrowiec Świętokrzyski",
  "Gniezno",
  "Stargard",
  "Piotrków Trybunalski",
  "Siemianowice Śląskie",
  "Suwałki",
  "Głogów",
  "Chełm",
  "Tomaszów Mazowiecki",
  "Przemyśl",
  "Stalowa Wola",
  "Zamość",
  "Kędzierzyn-Koźle",
  "Leszno",
  "Łomża",
  "Żory",
  "Bełchatów",
  "Tczew",
  "Świdnica",
  "Będzin",
  "Zgierz",
  "Pabianice",
  "Racibórz",
  "Zawiercie",
  "Ostrów Wielkopolski",
  "Starachowice"
];

export const getFilteredCities = (query: string, limit: number = 5): string[] => {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return popularPolishCities
    .filter(city => 
      city.toLowerCase().includes(normalizedQuery) ||
      city.toLowerCase().startsWith(normalizedQuery)
    )
    .slice(0, limit);
}; 