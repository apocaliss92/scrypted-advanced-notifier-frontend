import { useEffect } from "react";
import LoginPage from "./Auth/LoginPage";
import Layout from "./MainLayout/Layout";
import { useApi } from "./utils/api";
import { useEventStore } from "./utils/store";
import { Page } from "./utils/types";

import { Buffer } from "buffer";
import { ScryptedClient } from "./utils/scryptedClient";
globalThis.Buffer = Buffer;

function App() {
  const page = useEventStore((state) => state.page);
  const userInfo = useEventStore((state) => state.userInfo);

  const { remoteLog } = useApi();

  useEffect(() => {
    window.onerror = (...args) => remoteLog(...args.join(",").split(","));
  }, []);

  return (
    <ScryptedClient>
      {userInfo && page !== Page.Login ? <Layout /> : <LoginPage />}
    </ScryptedClient>
  );
}

export default App;
