import React from "react";
import {BranchesPage} from "./BranchesPage.web";
import {shallow} from "enzyme";
import {Platform} from "react-native";
import Table from "../../components/Table";
import theme from "../../constants/theme";
const mockProps = {
  translations: {
    title: "The page title",
    searchBranches: "Search branches...",
    createBranch: "Create branch",
    name: "Name",
    address: "Address",
    properties: "Properties",
    users: "Users",
    added: "Added",
    available: "available",
    availability: "Available",
  },
  fetchBranches: jest.fn(),
  go: jest.fn(),
  globaltheme: "light",
  theme,
  isAdmin: true,
  match: {
    isExact: false,
    params: {},
    path: "/branches",
    url: "/branches",
  },
};
const mockSearchProps = {
  placeholder: mockProps.translations.searchBranches,
};
const mockTableHeaders = [
  {name: "", id: 0},
  {name: "Name", id: 1},
  {name: "Address", id: 2},
  {name: "Properties", id: 3},
  {name: "Users", id: 4},
  {name: "Added", id: 5},
  {name: "", id: 6},
];

const mockTableButtonsTextArray = [{type: "primary", text: "Create branch"}];
describe("Branches", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<BranchesPage {...mockProps} />);
  });
  it("BranchesPage snapshot test on - " + Platform.OS, () => {
    expect(wrapper).toMatchSnapshot();
  });
  describe("Table", () => {
    it("renders Table properly", () => {
      expect(wrapper.find(Table)).toExist();
      expect(wrapper.find(Table)).toHaveProp(
        "fetchTableData",
        mockProps.fetchBranches,
      );
      expect(wrapper.find(Table)).toHaveProp("isAdmin", mockProps.isAdmin);
      expect(wrapper.find(Table)).toHaveProp("searchProps", mockSearchProps);
      expect(wrapper.find(Table)).toHaveProp("tableHeaders", mockTableHeaders);
      expect(wrapper.find(Table)).toHaveProp(
        "tableUtilBarButtons",
        mockTableButtonsTextArray,
      );
    });
  });
});
