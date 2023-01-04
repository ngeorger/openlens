/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import assert from "assert";
import { storesAndApisCanBeCreatedInjectionToken } from "../stores-apis-can-be-created.token";
import { VerticalPodAutoscalerApi } from "./vertical-pod-autoscaler.api";
import { kubeApiInjectionToken } from "../kube-api/kube-api-injection-token";

const verticalPodAutoscalerApiInjectable = getInjectable({
  id: "vertical-pod-autoscaler-api",
  instantiate: (di) => {
    assert(di.inject(storesAndApisCanBeCreatedInjectionToken), "verticalPodAutoscalerApi is only available in certain environments");

    return new VerticalPodAutoscalerApi();
  },

  injectionToken: kubeApiInjectionToken,
});

export default verticalPodAutoscalerApiInjectable;
