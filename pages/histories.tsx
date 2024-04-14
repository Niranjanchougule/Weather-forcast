import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Assuming you have a selector named "selectHistory" that retrieves the history list from the Redux store

import { selectHistories } from "@/redux/weatherSlice";
import Link from "next/link";

function HistoryList() {
  // Use useSelector hook to access the history list from the Redux store
  const historyList = useSelector(selectHistories);
  // using isClient because we are using local storage we need run our logic only on browser
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  // On server do nothing
  if (!isClient) {
    return <div className="min-h-screen">Loading...</div>;
  }
  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">History List</h2>
      <ul className="divide-y divide-gray-300">
        {historyList.map((item, index) => (
          <li key={index} className="py-4">
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-gray-500 mb-1">{item.date}</p>
                <Link href={item.url} className="text-blue-500 hover:underline">
                  {item.url}
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HistoryList;
