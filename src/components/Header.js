import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button, Navbar } from "flowbite-react";
import { isAuthenticated } from "../utils/authenticated";
import paths from "../constants/paths";

function Header() {
  const navigate = useNavigate();

  const pages = [{ to: paths.posts, text: "POSTS" }];

  function logout() {
    localStorage.removeItem("token");
    navigate(paths.login);
  }

  return (
    <header className="mb-8">
      <nav className="border py-3 px-1 md:px-10">
        <Navbar fluid={true} rounded={true}>
          <Navbar.Brand>
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white md:text-2xl">
              API Example
            </span>
          </Navbar.Brand>
          <div className="flex md:order-2">
            {isAuthenticated() ? (
              <Button size="sm" color="red" onClick={logout}>
                Logout
              </Button>
            ) : (
              <Link to={paths.login}>
                <Button size="sm">Login/Register</Button>
              </Link>
            )}
            <Navbar.Toggle />
          </div>
          <Navbar.Collapse>
            {pages.map((page) => (
              <NavLink key={page.text} to={page.to}>
                {({ isActive }) => (
                  <Navbar.Link active={isActive}>
                    <span className="text-sm md:text-lg">{page.text}</span>
                  </Navbar.Link>
                )}
              </NavLink>
            ))}
            <div className="grow"></div>
          </Navbar.Collapse>
        </Navbar>
      </nav>
    </header>
  );
}

export default Header;
