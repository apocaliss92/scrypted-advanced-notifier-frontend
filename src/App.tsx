import LoginPage from "./Auth/LoginPage";
import Layout from "./MainLayout/Layout";
import { useEventStore } from "./utils/store";
import { Page } from "./utils/types";

function App() {
  const userInfo = useEventStore((state) => state.userInfo);
  const page = useEventStore((state) => state.page);

  if (userInfo && page !== Page.Login) {
    return <Layout />;
  } else {
    return <LoginPage />;
  }
}

export default App;
