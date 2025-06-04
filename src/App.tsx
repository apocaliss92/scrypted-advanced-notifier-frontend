import { useEffect } from "react";
import LoginPage from "./Auth/LoginPage";
import Layout from "./MainLayout/Layout";
import { useEventStore } from "./utils/store";
import { Page } from "./utils/types";
import { useApi } from "./utils/api";

function App() {
  const userInfo = useEventStore((state) => state.userInfo);
  const page = useEventStore((state) => state.page);

  const { remoteLog } = useApi();

  useEffect(() => {
    window.onerror = (...args) => remoteLog(args.join(' '));
  }, []);

  if (userInfo && page !== Page.Login) {
    return <Layout />;
  } else {
    return <LoginPage />;
  }
}

export default App;
