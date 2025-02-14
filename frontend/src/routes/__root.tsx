import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: Root
});

function Navbar() {
  return (
    <div>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/expenses">
        Expenses
        </Link>
        <Link to="/create-expenses">
        Create
        </Link>
      </div>
    </div>
  );
}

function Root(){
    return(
        <>
        <Navbar/>
        <hr></hr>
        <Outlet/>
        </>
    )
}