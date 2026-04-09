import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/react";
import { useContext } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./../../Context/AuthContext";

// export const AcmeLogo = () => {
//   return (
//     <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
//       <path
//         clipRule="evenodd"
//         d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
//         fill="currentColor"
//         fillRule="evenodd"
//       />
//     </svg>
//   );
// };

export default function NavbarApp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const loggedmenuItems = ["home",  "Log Out"];
  const unloggedmenuItems = [ "register", "login"];
  const navigate=useNavigate();

  const { userLogin, setuserLogin } = useContext(AuthContext);
  function logOut(){
    localStorage.removeItem("userToken");
    setuserLogin(null);
    navigate("/login")
}
  return (
    <Navbar className="bg-blue-200  border-1 border-bottom  border-neutral-300 shadow-md ">
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />
      <NavbarBrand>
        {/* <AcmeLogo /> */}
        <p className="font-bold text-cyan-950 font-serif">
          <Link to="/">SOCIAL.APP</Link>
        </p>
      </NavbarBrand>

      <NavbarContent as="div" justify="end">
        <NavbarContent
          className="hidden sm:flex gap-4 text-cyan-1000"
          justify="end"
        >
          {userLogin !== null && (
            <NavbarItem>
              <Link color="foreground" to="/">
                Home
              </Link>
            </NavbarItem>
          )}
          {userLogin === null && (
            <>
              <NavbarItem>
                <Link color="foreground" to="/login">
                  Login
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link color="foreground" to="/register">
                  Register
                </Link>
              </NavbarItem>
            </>
          )}
        </NavbarContent>
        <Dropdown
          placement="bottom-end"
          className="bg-cyan-950 text-neutral-200"
        >
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform bg-red"
              color="primary"
              name="Jason Hughes"
              size="sm"
              //user logo
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem
              key="profile"
              className=" border-1 border-bottom border-light mb-1 text-cyan-950  bg-blue-200"
            >
              <Link to="/profile" className="block  w-ful">
                Profile
              </Link>
            </DropdownItem>
            <DropdownItem
              key="logout"
              onClick={logOut}
              className=" border-1 border-bottom border-light text-cyan-950 bg-blue-200"
              color="danger"
            >
              <Link className="block  w-ful" to="">Log Out</Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      <NavbarMenu className="bg-cyan-950 flex justify-center align-center">
        { userLogin ?loggedmenuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className={`w-full block font-bold text-center my-1 p-1 rounded-4xl ${index === loggedmenuItems.length - 1 ? " text-danger bg-red-200" : " bg-blue-200 text-cyan-950"}`}
              color={index === loggedmenuItems.length - 1 ? "danger" : "foreground"}
              to={`/${item ==="Log Out" ? "login":item}`}
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
          
        )):unloggedmenuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
            onClick={item==="Log Out" ? function(){logOut()}:null}
              className={`w-full block font-bold  text-center my-1 p-1 rounded-4xl ${index === unloggedmenuItems.length - 1 ? " text-danger  bg-red-200" : " bg-blue-200 text-cyan-950"}`}
              color={index === unloggedmenuItems.length - 1 ? "danger" : "foreground"}
              to={`/${item}`}
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>))}
      </NavbarMenu>
    </Navbar>
  );
}
