import React from "react";
import {shallow} from "enzyme/build";
import {TableHeaders} from "./TableHeaders";
import {extend} from "underscore";
import {AnimatedTrigger} from "../AnimatedTrigger";
import {ArrowLink} from "../common/layout";
describe("Table Headers", () => {
  it("renders Table Headers properly", () => {
    const mockTableHeaders = [
      {name: "", id: 0},
      {name: "Name", id: 1},
      {name: "Address", id: 2},
      {name: "Properties", id: 3},
      {name: "Users", id: 4},
      {name: "Added", id: 5},
      {name: "", id: 6},
    ];
    const component = getComponent({tableHeaders: mockTableHeaders});
    expect(component).toMatchSnapshot();
  });
  it("does not display table header name is empty", () => {
    const mockTableHeaders = [{name: "", id: 0}];
    const component = getComponent({tableHeaders: mockTableHeaders});
    expect(component.find(AnimatedTrigger)).not.toExist();
    expect(component.find(ArrowLink)).not.toExist();
  });
  const getMockProps = () => ({
    handleSort: () => {},
    checkColumnStyle: () => {},
    tableHeaders: [],
    theme: {},
    globaltheme: "light",
    isLoading: false,
  });
  const getComponent = props => {
    const parsedProps = extend(getMockProps(), props);

    return shallow(<TableHeaders {...parsedProps} />);
  };
});
