/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { BaseKubeObjectCondition, NamespaceScopedMetadata } from "../kube-object";
import { KubeObject } from "../kube-object";
import type { DerivedKubeApiOptions } from "../kube-api";
import { KubeApi } from "../kube-api";

export interface CrossVersionObjectReference {
  kind: string;
  name: string;
  apiVersion: string;
}

export type ResourceList = string[];

export interface RecommendedContainerResources {
  containerName: string;
  target: ResourceList;
  lowerBound?: ResourceList;
  upperBound?: ResourceList;
  uncappedTarget?: ResourceList;
}
export interface RecommendedPodResources {
  containerRecommendation?: RecommendedContainerResources[];
}

export interface VerticalPodAutoscalerStatus {
  recommendation?: RecommendedPodResources;
  conditions?: BaseKubeObjectCondition[];
}

export interface VerticalPodAutoscalerRecommenderSelector {
  name: string;
}

export enum ContainerScalingMode {
  ContainerScalingModeOff = "Off",
  ContainerScalingModeAuto = "Auto",
}

export interface ContainerResourcePolicy {
  containerName: string;
  mode?: ContainerScalingMode;
  minAllowed?: ResourceList;
  maxAllowed?: ResourceList;
  controlledResources: ResourceList;
}

export interface PodResourcePolicy {
  containerPolicies?: ContainerResourcePolicy[];
}

export enum UpdateMode {
  // UpdateModeOff means that autoscaler never changes Pod resources.
  // The recommender still sets the recommended resources in the
  // VerticalPodAutoscaler object. This can be used for a "dry run".
  UpdateModeOff = "Off",
  // UpdateModeInitial means that autoscaler only assigns resources on pod
  // creation and does not change them during the lifetime of the pod.
  UpdateModeInitial = "Initial",
  // UpdateModeRecreate means that autoscaler assigns resources on pod
  // creation and additionally can update them during the lifetime of the
  // pod by deleting and recreating the pod.
  UpdateModeRecreate = "Recreate",
  // UpdateModeAuto means that autoscaler assigns resources on pod creation
  // and additionally can update them during the lifetime of the pod,
  // using any available update method. Currently this is equivalent to
  // Recreate, which is the only available update method.
  UpdateModeAuto = "Auto",
}
export interface PodUpdatePolicy {
  updateMode?: UpdateMode;
  minReplicas?: number;
}

export interface VerticalPodAutoscalerSpec {
  targetRef: CrossVersionObjectReference;
  updatePolicy?: PodUpdatePolicy;
  resourcePolicy?: PodResourcePolicy;
  recommenders?: VerticalPodAutoscalerRecommenderSelector[];
}

export class VerticalPodAutoscaler extends KubeObject<
  NamespaceScopedMetadata,
  VerticalPodAutoscalerStatus,
  VerticalPodAutoscalerSpec
> {
  static readonly kind = "VerticalPodAutoscaler";
  static readonly namespaced = true;
  static readonly apiBase = "/apis/autoscaling.k8s.io/v1/verticalpodautoscalers";

  getReadyConditions() {
    return this.getConditions().filter(({ isReady }) => isReady);
  }

  getConditions() {
    return this.status?.conditions?.map(condition => {
      const { message, reason, lastTransitionTime, status } = condition;

      return {
        ...condition,
        isReady: status === "True",
        tooltip: `${message || reason} (${lastTransitionTime})`,
      };
    }) ?? [];
  }
}

export class VerticalPodAutoscalerApi extends KubeApi<VerticalPodAutoscaler> {
  constructor(opts?: DerivedKubeApiOptions) {
    super({
      objectConstructor: VerticalPodAutoscaler,
      ...opts ?? {},
    });
  }
}
