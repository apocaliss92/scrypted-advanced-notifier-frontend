import {
  connectScryptedClient,
  ScryptedClientOptions,
  ScryptedClientStatic,
} from "@scrypted/client/src";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useEventStore } from "./store";

const ScryptedClientContext = createContext<ScryptedClientStatic | undefined>(
  undefined
);

export const ScryptedClient = ({ children }: { children: ReactNode }) => {
  const userInfo = useEventStore((state) => state.userInfo);
  const [client, setClient] = useState<ScryptedClientStatic>();

  useEffect(() => {
    if (userInfo?.basicAuthToken) {
      const { basicAuthToken } = userInfo;
      const [username, password] = atob(
        basicAuthToken.split("Basic ")[1]
      ).split(":");
      const options: ScryptedClientOptions = {
        local: true,
        direct: false,
        webrtc: false,
        baseUrl: import.meta.env.VITE_CLIENT_BASE_URL,
        pluginId: "@scrypted/core",
        username,
        password,
      };
      connectScryptedClient(options).then((client) => {
        setClient(client);
      });
    }
  }, [userInfo]);

  return (
    <ScryptedClientContext.Provider value={client}>
      {children}
    </ScryptedClientContext.Provider>
  );
};

export const useScryptedClientContext = () => {
  const ctx = useContext(ScryptedClientContext!);
  return ctx;
};
