import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminProvider from "./providers/AdminProvider";
import Routes from "./router/routes";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SocketContext, socket } from "./contexts";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

const App = () => {

  const client = new QueryClient();

  return (
    <>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={client}>
          <SocketContext.Provider value={socket}>
            <AdminProvider>
              <Routes />
              <ToastContainer />
            </AdminProvider>
          </SocketContext.Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
