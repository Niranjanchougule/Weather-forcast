import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-gray-800 py-4 px-6">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-semibold">Weather App</h1>
        <nav>
          <Link
            className="text-white hover:text-gray-300 ml-4"
            href="/favorites"
          >
            Favorites
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
