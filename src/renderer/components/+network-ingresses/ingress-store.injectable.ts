/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import assert from "assert";
import { kubeObjectStoreInjectionToken } from "../../../common/k8s-api/api-manager/manager.injectable";
import ingressApiInjectable from "../../../common/k8s-api/endpoints/ingress.api.injectable";
import clusterFrameContextForNamespacedResourcesInjectable from "../../cluster-frame-context/for-namespaced-resources.injectable";
import storesAndApisCanBeCreatedInjectable from "../../stores-apis-can-be-created.injectable";
import { IngressStore } from "./ingress-store";

const ingressStoreInjectable = getInjectable({
  id: "ingress-store",
  instantiate: (di) => {
    assert(di.inject(storesAndApisCanBeCreatedInjectable), "ingressStore is only available in certain environments");

    const api = di.inject(ingressApiInjectable);

    return new IngressStore({
      context: di.inject(clusterFrameContextForNamespacedResourcesInjectable),
    }, api);
  },
  injectionToken: kubeObjectStoreInjectionToken,
});

export default ingressStoreInjectable;
