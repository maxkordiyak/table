import React from "react";
import Table from "../../components/Table";
import {bool, func, shape, string, oneOf} from "prop-types";

export const BranchesPage = ({
  translations,
  isAdmin,
  globaltheme,
  fetchBranches,
  go,
}) => {
  const tableHeaders = [
    {name: "", id: 0},
    {name: translations.name, id: 1},
    {name: translations.address, id: 2},
    {name: translations.properties, id: 3},
    {name: translations.users, id: 4},
    {name: translations.added, id: 5},
    {name: "", id: 6},
  ];
  const searchProps = {
    placeholder: translations.searchBranches,
  };

  const tableUtilBarButtons = [
    {type: "primary", text: translations.createBranch},
  ];
  const goTo = branchItem => {
    const {id} = branchItem;
    go(`/branches/${id}`);
  };
  const rowOnclickActions = [goTo];

  return (
    <Table
      fetchTableData={fetchBranches}
      tableUtilBarButtons={tableUtilBarButtons}
      isAdmin={isAdmin}
      searchProps={searchProps}
      tableHeaders={tableHeaders}
      globaltheme={globaltheme}
      rowIcon="star"
      rowOnclickActions={rowOnclickActions}
    />
  );
};
BranchesPage.propTypes = {
  translations: shape({
    searchBranches: string.isRequired,
    createBranch: string.isRequired,
    name: string.isRequired,
    address: string.isRequired,
    properties: string.isRequired,
    users: string.isRequired,
    added: string.isRequired,
  }),
  isAdmin: bool.isRequired,
  fetchBranches: func.isRequired,
  globaltheme: oneOf(["light", "dark"]),
  go: func.isRequired,
};
