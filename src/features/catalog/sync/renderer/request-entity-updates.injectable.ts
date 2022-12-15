/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { sendMessageToChannelInjectionToken } from "../../../../common/utils/channel/message-to-channel-injection-token";
import { catalogSendEntityUpdatesChannel } from "../common/sync-channels";

export type RequestCatalogEntityUpdates = () => void;

const requestCatalogEntityUpdatesInjectable = getInjectable({
  id: "request-catalog-entity-updates",
  instantiate: (di) => {
    const sendMessageToChannel = di.inject(sendMessageToChannelInjectionToken);

    return () => sendMessageToChannel(catalogSendEntityUpdatesChannel);
  },
});

export default requestCatalogEntityUpdatesInjectable;
