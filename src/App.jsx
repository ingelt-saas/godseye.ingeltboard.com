import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminProvider from "./providers/AdminProvider";
import Routes from "./router/routes";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const client = new QueryClient();

  return (
    <>
      <QueryClientProvider client={client}>
        <AdminProvider>
          <Routes />
          <ToastContainer />
        </AdminProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
