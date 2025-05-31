import LoginPage from "./Auth/LoginPage";
import Layout from "./MainLayout/Layout";
import { useEventStore } from "./utils/store";

function App() {
  const userInfo = useEventStore((state) => state.userInfo);

  if (userInfo) {
    return <Layout />;
  } else {
    return <LoginPage />;
  }
}

export default App;
