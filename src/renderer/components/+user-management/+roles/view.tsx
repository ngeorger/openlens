/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./view.scss";

import { observer } from "mobx-react";
import React from "react";
import { KubeObjectListLayout } from "../../kube-object-list-layout";
import { KubeObjectStatusIcon } from "../../kube-object-status-icon";
import { SiblingsInTabLayout } from "../../layout/siblings-in-tab-layout";
import { KubeObjectAge } from "../../kube-object/age";
import type { RoleStore } from "./store";
import { prevDefault } from "../../../utils";
import type { FilterByNamespace } from "../../+namespaces/namespace-select-filter-model/filter-by-namespace.injectable";
import { withInjectables } from "@ogre-tools/injectable-react";
import filterByNamespaceInjectable from "../../+namespaces/namespace-select-filter-model/filter-by-namespace.injectable";
import roleStoreInjectable from "./store.injectable";
import type { OpenAddRoleDialog } from "./add-dialog/open.injectable";
import openAddRoleDialogInjectable from "./add-dialog/open.injectable";
import { AddRoleDialog } from "./add-dialog/view";

enum columnId {
  name = "name",
  namespace = "namespace",
  age = "age",
}

interface Dependencies {
  roleStore: RoleStore;
  filterByNamespace: FilterByNamespace;
  openAddRoleDialog: OpenAddRoleDialog;
}

const NonInjectedRoles = observer(({
  roleStore,
  openAddRoleDialog,
  filterByNamespace,
}: Dependencies) => (
  <SiblingsInTabLayout>
    <KubeObjectListLayout
      isConfigurable
      tableId="access_roles"
      className="Roles"
      store={roleStore}
      sortingCallbacks={{
        [columnId.name]: role => role.getName(),
        [columnId.namespace]: role => role.getNs(),
        [columnId.age]: role => -role.getCreationTimestamp(),
      }}
      searchFilters={[
        role => role.getSearchFields(),
      ]}
      renderHeaderTitle="Roles"
      renderTableHeader={[
        { title: "Name", className: "name", sortBy: columnId.name, id: columnId.name },
        { className: "warning", showWithColumn: columnId.name },
        { title: "Namespace", className: "namespace", sortBy: columnId.namespace, id: columnId.namespace },
        { title: "Age", className: "age", sortBy: columnId.age, id: columnId.age },
      ]}
      renderTableContents={role => [
        role.getName(),
        <KubeObjectStatusIcon key="icon" object={role} />,
        <a
          key="namespace"
          className="filterNamespace"
          onClick={prevDefault(() => filterByNamespace(role.getNs()))}
        >
          {role.getNs()}
        </a>,
        <KubeObjectAge key="age" object={role} />,
      ]}
      addRemoveButtons={{
        onAdd: openAddRoleDialog,
        addTooltip: "Create new Role",
        "data-testid": "roles-view",
      }}
    />
    <AddRoleDialog />
  </SiblingsInTabLayout>
));

export const Roles = withInjectables<Dependencies>(NonInjectedRoles, {
  getProps: (di, props) => ({
    ...props,
    openAddRoleDialog: di.inject(openAddRoleDialogInjectable),
    roleStore: di.inject(roleStoreInjectable),
    filterByNamespace: di.inject(filterByNamespaceInjectable),
  }),
});
