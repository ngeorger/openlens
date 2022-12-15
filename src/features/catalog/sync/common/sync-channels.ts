/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { MessageChannel } from "../../../../common/utils/channel/message-channel-listener-injection-token";
import type { CatalogEntityData, CatalogEntityKindData } from "../../../../common/catalog/catalog-entity";

export const catalogEntityUpdatesChannel: MessageChannel<(CatalogEntityData & CatalogEntityKindData)[]> = {
  id: "catalog-entity-updates",
};

export const catalogSendEntityUpdatesChannel: MessageChannel<void> = {
  id: "catalog-send-entity-updates",
};
