/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./vpa.scss";

import React from "react";
import { observer } from "mobx-react";
import { KubeObjectListLayout } from "../kube-object-list-layout";
import type { VerticalPodAutoscaler } from "../../../common/k8s-api/endpoints/vertical-pod-autoscaler.api";
import { Badge } from "../badge";
import { cssNames, prevDefault } from "../../utils";
import { KubeObjectStatusIcon } from "../kube-object-status-icon";
import { SiblingsInTabLayout } from "../layout/siblings-in-tab-layout";
import { KubeObjectAge } from "../kube-object/age";
import type { VerticalPodAutoscalerStore } from "./store";
import type { FilterByNamespace } from "../+namespaces/namespace-select-filter-model/filter-by-namespace.injectable";
import { withInjectables } from "@ogre-tools/injectable-react";
import filterByNamespaceInjectable from "../+namespaces/namespace-select-filter-model/filter-by-namespace.injectable";
import verticalPodAutoscalerStoreInjectable from "./store.injectable";

enum columnId {
  name = "name",
  namespace = "namespace",
  metrics = "metrics",
  minPods = "min-pods",
  maxPods = "max-pods",
  replicas = "replicas",
  age = "age",
  status = "status",
}

interface Dependencies {
  verticalPodAutoscalerStore: VerticalPodAutoscalerStore;
  filterByNamespace: FilterByNamespace;
}

@observer
class NonInjectedVerticalPodAutoscalers extends React.Component<Dependencies> {
  getTargets(vpa: VerticalPodAutoscaler) {
    const metrics = vpa.getMetrics();

    if (metrics.length === 0) {
      return <p>--</p>;
    }

    const metricsRemain = metrics.length > 1 ? `+${metrics.length - 1} more...` : "";

    return (
      <p>
        {vpa.getMetricValues(metrics[0])}
        {" "}
        {metricsRemain}
      </p>
    );
  }

  render() {
    return (
      <SiblingsInTabLayout>
        <KubeObjectListLayout
          isConfigurable
          tableId="configuration_vpa"
          className="VerticalPodAutoscalers"
          store={this.props.verticalPodAutoscalerStore}
          sortingCallbacks={{
            [columnId.name]: vpa => vpa.getName(),
            [columnId.namespace]: vpa => vpa.getNs(),
            [columnId.minPods]: vpa => vpa.getMinPods(),
            [columnId.maxPods]: vpa => vpa.getMaxPods(),
            [columnId.replicas]: vpa => vpa.getReplicas(),
            [columnId.age]: vpa => -vpa.getCreationTimestamp(),
          }}
          searchFilters={[
            vpa => vpa.getSearchFields(),
          ]}
          renderHeaderTitle="Vertical Pod Autoscalers"
          renderTableHeader={[
            { title: "Name", className: "name", sortBy: columnId.name },
            { className: "warning", showWithColumn: columnId.name },
            { title: "Namespace", className: "namespace", sortBy: columnId.namespace, id: columnId.namespace },
            { title: "Metrics", className: "metrics", id: columnId.metrics },
            { title: "Min Pods", className: "min-pods", sortBy: columnId.minPods, id: columnId.minPods },
            { title: "Max Pods", className: "max-pods", sortBy: columnId.maxPods, id: columnId.maxPods },
            { title: "Replicas", className: "replicas", sortBy: columnId.replicas, id: columnId.replicas },
            { title: "Age", className: "age", sortBy: columnId.age, id: columnId.age },
            { title: "Status", className: "status scrollable", id: columnId.status },
          ]}
          renderTableContents={vpa => [
            vpa.getName(),
            <KubeObjectStatusIcon key="icon" object={vpa} />,
            <a
              key="namespace"
              className="filterNamespace"
              onClick={prevDefault(() => this.props.filterByNamespace(vpa.getNs()))}
            >
              {vpa.getNs()}
            </a>,
            this.getTargets(vpa),
            vpa.getMinPods(),
            vpa.getMaxPods(),
            vpa.getReplicas(),
            <KubeObjectAge key="age" object={vpa} />,
            vpa.getConditions()
              .filter(({ isReady }) => isReady)
              .map(({ type, tooltip }) => (
                <Badge
                  key={type}
                  label={type}
                  tooltip={tooltip}
                  className={cssNames(type.toLowerCase())}
                  expandable={false}
                  scrollable={true}
                />
              )),
          ]}
        />
      </SiblingsInTabLayout>
    );
  }
}

export const VerticalPodAutoscalers = withInjectables<Dependencies>(NonInjectedVerticalPodAutoscalers, {
  getProps: (di, props) => ({
    ...props,
    filterByNamespace: di.inject(filterByNamespaceInjectable),
    verticalPodAutoscalerStore: di.inject(verticalPodAutoscalerStoreInjectable),
  }),
});
