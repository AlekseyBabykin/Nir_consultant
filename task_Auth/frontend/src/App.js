import { Routes, Route } from "react-router-dom";

import CreateOrg from "./pages/CreateOrg";
import "./App.css";
import NotFound from "./pages/NotFound";

import { Navbar } from "./components";
import HomePage from "./pages/HomePage";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";
import AddUser from "./pages/AddUser";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />

          <Route path="/create-org" element={<CreateOrg />} />
          <Route path="/signin" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/add-user-to-org" element={<AddUser />} />
        </Routes>
      </div>
    </>
  );
}
export default App;
