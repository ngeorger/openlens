/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getMessageChannelListenerInjectable } from "../../../../common/utils/channel/message-channel-listener-injection-token";
import { catalogSendEntityUpdatesChannel } from "../common/sync-channels";
import catalogEntityChangeSetInjectable from "./entity-change-set.injectable";
import entityUpdateBroadcasterInjectable from "./entity-update-broadcaster.injectable";

const catalogSendEntityUpdatesListenerInjectable = getMessageChannelListenerInjectable({
  channel: catalogSendEntityUpdatesChannel,
  id: "main",
  handler: (di) => {
    const catalogEntityChangeSet = di.inject(catalogEntityChangeSetInjectable);
    const entityUpdateBroadcaster = di.inject(entityUpdateBroadcasterInjectable);

    return () => {
      entityUpdateBroadcaster.cancel();
      entityUpdateBroadcaster(catalogEntityChangeSet.get());
    };
  },
});

export default catalogSendEntityUpdatesListenerInjectable;
