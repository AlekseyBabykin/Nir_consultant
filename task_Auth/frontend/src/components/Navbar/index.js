import Container from "react-bootstrap/Container";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <Container>
        <a className="navbar-brand" href="/">
          Navbar
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse mx-auto"
          id="navbarSupportedContent"
        >
          <a className="p-2 nav-link text-white" href="/signup">
            Registration
          </a>
          <a className="p-2 nav-link text-white" href="/signin">
            Login
          </a>

          <a className="p-2 nav-link text-warning" href="/create-org">
            Create-organization
          </a>
          <a className="p-2 nav-link text-warning" href="/add-user-to-org">
            Add-users
          </a>
        </div>
      </Container>
    </nav>
  );
};
