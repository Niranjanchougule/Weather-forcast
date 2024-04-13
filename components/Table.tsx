import { CityDetails, tableHeaders } from "@/pages";
import Link from "next/link";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

interface TableProps {
  data: CityDetails[];
  sortBy: keyof CityDetails | null;
  sortOrder: "asc" | "desc";
  onSort: (column: keyof CityDetails, order: "asc" | "desc") => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

const Table: React.FC<TableProps> = ({
  data,
  sortBy,
  sortOrder,
  onSort,
  onLoadMore,
  hasMore,
}) => {
  const handleSort = (column: keyof CityDetails) => {
    onSort(column, sortOrder);
  };

  const renderSortSymbol = (column: keyof CityDetails) => {
    if (sortBy === column) {
      return sortOrder === "asc" ? "↑" : "↓";
    }
    return null;
  };

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {tableHeaders.map((header) => (
            <th
              key={header.key}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort(header.key as keyof CityDetails)}
            >
              {header.label}
              <span className="ml-1">
                {renderSortSymbol(header.key as keyof CityDetails)}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <InfiniteScroll
        pageStart={0}
        loadMore={onLoadMore}
        hasMore={hasMore}
        element="tbody"
        loader={
          <tr key={0}>
            <td colSpan={6} className="text-center">
              Loading...
            </td>
          </tr>
        }
        useWindow={true}
        className="bg-white divide-y divide-gray-200"
      >
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-50" : ""}>
            {tableHeaders.map((header) => (
              <td
                key={header.key}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
              >
                {}
                {header.key === "ascii_name" ? (
                  <Link
                    target="_blank"
                    href={{
                      pathname: `weather/${row[header.key]}`,
                      query: { lat: row.lat, lon: row.lon },
                    }}
                  >
                    {row[header.key]}
                  </Link>
                ) : (
                  row[header.key]
                )}
              </td>
            ))}
          </tr>
        ))}
      </InfiniteScroll>
    </table>
  );
};

export default Table;
