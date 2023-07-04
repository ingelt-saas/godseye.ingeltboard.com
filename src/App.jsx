import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminProvider from "./providers/AdminProvider";
import Routes from "./router/routes";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SocketContext, socket } from "./contexts";

const App = () => {

  const client = new QueryClient();

  return (
    <>
      <QueryClientProvider client={client}>
        <SocketContext.Provider value={socket}>
          <AdminProvider>
            <Routes />
            <ToastContainer />
          </AdminProvider>
        </SocketContext.Provider>
      </QueryClientProvider>
    </>
  );
}

export default App;
