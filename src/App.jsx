import AdminProvider from "./providers/AdminProvider";
import Routes from "./router/routes";

const App = () => {
  return (
    <>
      <AdminProvider>
        <Routes />
      </AdminProvider>
    </>
  );
}

export default App;
