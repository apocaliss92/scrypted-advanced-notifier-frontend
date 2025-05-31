import { ScryptedEventSource } from "./types";
// @ts-ignore
import ScryptedIcon from "../scrypted.svg?react";
// @ts-ignore
import FrigateIcon from "../frigate.svg?react";

export const SourceIcon = (props: {
  eventSource: ScryptedEventSource;
  small?: boolean;
}) => {
  const { eventSource } = props;
  // const size = small ? "16" : undefined;

  switch (eventSource) {
    case ScryptedEventSource.Frigate:
      return <FrigateIcon />;
    case ScryptedEventSource.NVR:
      return <ScryptedIcon />;
  }
};
