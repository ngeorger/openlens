/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import assert from "assert";
import { kubeObjectStoreInjectionToken } from "../../../common/k8s-api/api-manager/manager.injectable";
import verticalPodAutoscalerApiInjectable from "../../../common/k8s-api/endpoints/vertical-pod-autoscaler.api.injectable";
import clusterFrameContextForNamespacedResourcesInjectable from "../../cluster-frame-context/for-namespaced-resources.injectable";
import storesAndApisCanBeCreatedInjectable from "../../stores-apis-can-be-created.injectable";
import { VerticalPodAutoscalerStore } from "./store";

const verticalPodAutoscalerStoreInjectable = getInjectable({
  id: "vertical-pod-autoscaler-store",
  instantiate: (di) => {
    assert(di.inject(storesAndApisCanBeCreatedInjectable), "verticalPodAutoscalerStore is only available in certain environments");

    const api = di.inject(verticalPodAutoscalerApiInjectable);

    return new VerticalPodAutoscalerStore({
      context: di.inject(clusterFrameContextForNamespacedResourcesInjectable),
    }, api);
  },
  injectionToken: kubeObjectStoreInjectionToken,
});

export default verticalPodAutoscalerStoreInjectable;
