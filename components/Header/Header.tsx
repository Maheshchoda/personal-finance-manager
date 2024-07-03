import HeaderLogo from "./HeaderLogo";
import Navigation from "./Navigation";

const Header = () => {
  return (
    <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 pb-36 lg:px-14">
      <nav className="mx-auto max-w-screen-2xl">
        <div className="">
          <div className="flex items-center lg:gap-x-16">
            <HeaderLogo />
            <Navigation />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
