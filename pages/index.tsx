import Image from "next/image";
import { Inter } from "next/font/google";
import SearchCity from "@/components/SearchCity";
import Table from "@/components/Table";
import { use, useEffect, useState } from "react";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });
export interface CityDetails {
  geoname_id: number;
  ascii_name: string;
  cou_name_en: string;
  population: number;
  lat: string;
  lon: string;
}
export const tableHeaders: { key: keyof CityDetails; label: string }[] = [
  { key: "geoname_id", label: "Geoname ID" },
  { key: "ascii_name", label: "City" },
  { key: "cou_name_en", label: "Country" },
  { key: "population", label: "Population" },
];

export default function Home() {
  const [weatherData, setWeatherData] = useState<CityDetails[]>([]);
  const [sortBy, setSortBy] = useState<keyof CityDetails | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  const fetchData = async () => {
    try {
      const url = new URL(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records`
      );
      url.searchParams.append("limit", "20");
      url.searchParams.append("offset", `${page * 20}`);
      if (sortBy) {
        url.searchParams.append("order_by", `${sortBy} ${sortOrder}`);
      }
      if (search) {
        url.searchParams.append("where", `search(ascii_name,"${search}")`);
      }
      const response = await fetch(url.toString());
      const data = await response.json();

      if (weatherData?.length === data.total_count) {
        setHasMore(false);
      }

      const resultList: CityDetails[] = data.results.map((city: any) => ({
        geoname_id: city.geoname_id,
        ascii_name: city.ascii_name,
        cou_name_en: city.cou_name_en,
        population: city.population,
        lat: city.coordinates.lat.toString(),
          lon: city.coordinates.lon.toString(),
      }));
      setWeatherData([...weatherData, ...resultList]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleSort = (column: keyof CityDetails, order: "asc" | "desc") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }

    // because this is pagination, we need to reset the page to 1
    setWeatherData([]);
    setPage(0);
    setHasMore(true);
    // InfiniteScroll will call fetchData() as data was reset
  };

  const handleSearch = (city: string) => {
    setSearch(city);

    // because this is pagination, we need to reset the page to 1
    setWeatherData([]);
    setPage(0);
    setHasMore(true);
    // InfiniteScroll will call fetchData() as data was reset
  };
  return (
    <main className={`flex min-h-screen justify-center`}>
      
      <div className="bg-gray-100 p-8 flex flex-col gap-10 ">
      <Header/>
        <div className="">
          <SearchCity onSearch={handleSearch} />
        </div>

        <div className="container mx-auto">
          <Table
            data={weatherData}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onLoadMore={fetchData}
            hasMore={hasMore}
          />
        </div>
      </div>
    </main>
  );
}
