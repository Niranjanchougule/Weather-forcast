import dynamic from "next/dynamic";
import React, { useState } from "react";
const AsyncPaginate = dynamic(
  () => import("react-select-async-paginate").then((mod) => mod.AsyncPaginate),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);

type SelectOption = {
  label: string;
  value: string;
};
interface SearchCityProps {
  onSearch: (city: string) => void;
}
const SearchCity = ({ onSearch }: SearchCityProps) => {
  const [value, setValue] = useState<SelectOption | null>(null);
  const loadOptions = async (search: string) => {
    if (search) {
      onSearch(search);
    }

    // fetch data from the API based on the search query (city name)
    const response = await fetch(
      `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?select=ascii_name&limit=10${
        search && `&where=search(ascii_name,"${search}")`
      }`
    );
    const data = await response.json();
    // transform the data into the format that react-select-async-paginate expects
    return {
      options: data.results.map((city: any) => ({
        label: city.ascii_name,
        value: city.ascii_name,
      })),
    };
  };

  const handleOnChange = (selectedOption: any) => {
    setValue(selectedOption);
    if (selectedOption === null) {
      onSearch("");
    } else {
      onSearch(selectedOption.value);
    }
  };
  return (
    <div>
      <AsyncPaginate
        value={value}
        onChange={handleOnChange}
        loadOptions={loadOptions}
        debounceTimeout={300}
        isClearable
        placeholder="Type here..."
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
        menuPlacement="auto"
        components={{
          DropdownIndicator: null,
          IndicatorSeparator: null,
        }}
      />
    </div>
  );
};

export default SearchCity;
