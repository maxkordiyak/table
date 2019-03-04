import React from "react";
import {shallow} from "enzyme/build";
import {TableComponentItem} from "./TableComponentItem";
import {extend} from "underscore";
import {
  TableData,
  TableDataText,
  TableDataImage,
  RowIcon,
  ArrowIcon,
} from "./Table.styles";
describe("TableComponentItem", () => {
  it("renders TableComponentItem properly", () => {
    const component = getComponent();
    expect(component).toMatchSnapshot();
  });
  it("doesn't render a table cell for `id` property", () => {
    const item = {
      id: "1",
      name: "South Kenyattaland",
      address: "7131 Legros Island",
      properties: 84245,
      users: 61281,
      added: "2018-03-24T17:19:29.327Z",
    };
    const component = getComponent({item});
    const tableData = component.find(TableData);
    expect(tableData).toHaveLength(7); // first one is an Icon
  });
  it("truncates text for `address` property", async () => {
    const item = {
      id: "1",
      name: "South Kenyattaland",
      address: "7131 Legros Island",
      properties: 84245,
      users: 61281,
      added: "2018-03-24T17:19:29.327Z",
    };
    const component = getComponent({item});
    const tableDataTextAddress = component
      .find(TableData)
      .findWhere(text => text.prop("data-label") === "Address");
    expect(tableDataTextAddress.find(TableDataText)).toHaveProp(
      "truncateText",
      true,
    );
  });
  it("doesn't render RowIcon when `withImage` is passed", async () => {
    const item = {
      id: "1",
      name: "South Kenyattaland",
      address: "7131 Legros Island",
      properties: 84245,
      users: 61281,
      added: "2018-03-24T17:19:29.327Z",
    };
    const component = getComponent({item, withImage: true});
    expect(component.find(RowIcon)).not.toExist();
  });
  it("renders RowIcon when `withImage` is not passed", async () => {
    const item = {
      id: "1",
      name: "South Kenyattaland",
      address: "7131 Legros Island",
      properties: 84245,
      users: 61281,
      added: "2018-03-24T17:19:29.327Z",
    };
    const component = getComponent({item, withImage: false});
    expect(component.find(RowIcon)).toExist();
  });
  it("passes a date when key is `added`", async () => {
    const item = {
      id: "1",
      name: "South Kenyattaland",
      address: "7131 Legros Island",
      properties: 84245,
      users: 61281,
      added: "2018-03-24T17:19:29.327Z",
    };
    const component = getComponent({item});
    const tableDataTextAdded = component
      .find(TableData)
      .findWhere(text => text.prop("data-label") === "Added");
    const dateField = tableDataTextAdded.find(TableDataText).props().children;
    expect(new Date(dateField) instanceof Date).toBe(true);
  });
  it("passes an image when key is `image`", async () => {
    const item = {
      id: "1",
      image: "https://s3.amazonaws.com/uifaces/faces/twitter/vanchesz/128.jpg",
      address: "2733 Witting Causeway",
      rent: "438.22",
      availability: 78066,
      added: "2018-03-15T06:31:59.582Z",
    };
    const component = getComponent({item});
    const tableDataImagePreview = component
      .find(TableData)
      .findWhere(text => text.prop("data-label") === "Image");
    expect(tableDataImagePreview.find(TableDataImage).prop("src")).toBe(
      item.image,
    );
  });

  it("passes right props to the RowIcon", () => {
    const item = {
      id: "1",
      name: "South Kenyattaland",
      address: "7131 Legros Island",
      properties: 84245,
      users: 61281,
      added: "2018-03-24T17:19:29.327Z",
    };
    const component = getComponent({item, withImage: false});
    expect(component.find(RowIcon).prop("src")).toEqual("email-pending.svg");
  });

  it("triggers `action` passed to it when ArrowIcon was clicked", async () => {
    const action = jest.fn();
    const item = {
      id: "1",
      name: "South Kenyattaland",
      address: "7131 Legros Island",
      properties: 84245,
      users: 61281,
      added: "2018-03-24T17:19:29.327Z",
    };
    const component = getComponent({item, action});
    await component.find(ArrowIcon).prop("onClick")(item);
    await expect(action).toHaveBeenCalledWith(item);
  });

  it("adds arrow-right icon when no `actionIcon` was passed", () => {
    const item = {
      id: "1",
      name: "South Kenyattaland",
      address: "7131 Legros Island",
      properties: 84245,
      users: 61281,
      added: "2018-03-24T17:19:29.327Z",
    };
    const component = getComponent({item, actionIcon: null});
    expect(component.find(ArrowIcon).prop("name")).toEqual("arrow-right");
  });

  const getMockProps = () => ({
    item: {},
    theme: {},
    globaltheme: "light",
    isLoading: false,
    withImage: false,
    icon: "email-pending",
    action: () => {},
    actionIcon: "close",
  });
  const getComponent = props => {
    const parsedProps = extend(getMockProps(), props);

    return shallow(<TableComponentItem {...parsedProps} />);
  };
});
