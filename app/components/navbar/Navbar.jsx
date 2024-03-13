import FirendLink from "@/app/components/navbar/FriendLink";

const Navbar = () => {
  return (
    <div className="bg-gray-800 text-white border-solid border-stone-900 bottom-2 shadow-xl">
      <div className="navbar lg:w-1/2 mx-auto">
        <div className="navbar-start"></div>
        <div className="navbar-end lg:flex text-sm">
          <FirendLink />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
