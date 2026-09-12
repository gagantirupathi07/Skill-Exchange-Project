import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="app-layout">

      <Navbar />

      <div className="app-content-wrapper">

        <Sidebar />

        <main className="app-main">
          <div className="page-container">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}

export default Layout;