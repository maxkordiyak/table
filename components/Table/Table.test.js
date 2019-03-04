import React from "react";
import {shallow} from "enzyme/build";
import {SortableTable} from "./Table.web";
import {
  TableUtilBarButton,
  TableErrorMessage,
  TabItem,
  TabsContainer,
} from "./Table.styles";
import {initialState} from "../../__mocks__/initialState";
import configureStore from "redux-mock-store";
import {extend} from "underscore";
import InfiniteScrollList from "../InfiniteScrollList";
import Search from "../Search";
import {TableComponentItem} from "./TableComponentItem";

const mockTableHeaders = [
  {name: "", id: 0},
  {name: "Name", id: 1},
  {name: "Address", id: 2},
  {name: "Properties", id: 3},
  {name: "Users", id: 4},
  {name: "Added", id: 5},
  {name: "", id: 6},
];

const searchProps = {
  placeholder: "Search branches...",
};

const goTo = jest.fn();

jest.mock("./TableComponentItem.js");

const mockTableButtonsTextArray = [
  {type: "primary", text: "Request rent passport", action: goTo},
];

const tabs = [
  {
    title: "Shared",
    value: "status",
  },
  {
    title: "Pending",
    value: "status",
  },
];

const openRemoveRequestDialog = jest.fn();

const rowOnclickActions = [goTo, openRemoveRequestDialog];
const rowIcons = ["rent-passport", "email-pending"];
const rowOnclickActionIcons = ["arrow-right", "close"];

const mockStore = configureStore();
describe("Table", () => {
  beforeEach(() => {
    TableComponentItem.mockClear();
  });

  it("renders Table properly", () => {
    const component = getComponent();
    expect(component).toMatchSnapshot();
  });

  it("fetches data when the Table is mounted", async () => {
    const fetchTableData = jest.fn();
    await getComponent({fetchTableData});
    expect(fetchTableData).toHaveBeenCalled();
  });
  it("sends more data to InfiniteScrollList when loadAsyncData is called", async () => {
    const fetchTableData = jest.fn();
    const component = getComponent({fetchTableData});
    const loadAsyncData = component.find(InfiniteScrollList).prop("loadMore");
    await loadAsyncData();
    component.update();
    expect(fetchTableData).toHaveBeenCalled();
  });
  test("the data requested by table has a right order parameter passed to it", async () => {
    const fetchTableData = jest.fn();
    const component = getComponent({fetchTableData});
    const columnName = {target: {id: "address"}};
    const params = {
      limit: 10,
      order: "asc",
      orderBy: columnName.target.id,
      page: 1,
      search: "",
      status: "",
    };
    const handleSort = component.find(InfiniteScrollList).prop("handleSort");
    await handleSort(columnName);
    component.update();
    expect(fetchTableData).toHaveBeenCalledWith({params});
  });
  it("calls loadMore with the right data passed to it", async () => {
    const fetchTableData = jest.fn();
    const component = getComponent({fetchTableData});
    const params = {
      limit: 10,
      order: "desc",
      orderBy: "name",
      page: 2,
      search: "",
      status: "",
    };
    const loadMore = component.find(InfiniteScrollList).prop("loadMore");
    await loadMore();
    component.update();
    expect(fetchTableData).toHaveBeenCalledWith({params});
  });

  it("calls loadMore and passes new set of data to the `InfiniteScroll`", async () => {
    const fakeData = [
      {
        id: "1",
        name: "East Leola",
        address: "22 Lansdowne Crescent, Notting Hill",
        properties: 111,
        users: 111,
        added: "2018-09-22T00:03:53.650Z",
      },
    ];
    const moreFakeData = [
      {
        id: "2",
        name: "East Leola",
        address: "22 Lansdowne Crescent, Notting Hill",
        properties: 777,
        users: 777,
        added: "2018-09-21T00:03:53.650Z",
      },
    ];
    const expectedDataAfterLoadedMore = [
      {
        id: "1",
        name: "East Leola",
        address: "22 Lansdowne Crescent, Notting Hill",
        properties: 111,
        users: 111,
        added: "2018-09-22T00:03:53.650Z",
      },
      {
        id: "2",
        name: "East Leola",
        address: "22 Lansdowne Crescent, Notting Hill",
        properties: 777,
        users: 777,
        added: "2018-09-21T00:03:53.650Z",
      },
    ];
    const props = getMockProps();
    props.fetchTableData = jest.fn();
    props.fetchTableData
      .mockReturnValue(moreFakeData)
      .mockReturnValueOnce(fakeData);
    const component = await getComponent(props);
    await expect(props.fetchTableData).toHaveBeenCalled();
    await component.find(InfiniteScrollList).prop("loadMore")();
    await expect(props.fetchTableData).toHaveBeenCalled();
    const newData = component.find(InfiniteScrollList).prop("data");

    await expect(newData).toEqual(expectedDataAfterLoadedMore);
  });

  it("displays button for each tableUtilBarButtons when user is admin", () => {
    const fetchTableData = jest.fn();
    const component = getComponent({
      fetchTableData,
      isAdmin: true,
      tableUtilBarButtons: mockTableButtonsTextArray,
    });
    expect(component.find(TableUtilBarButton)).toExist();
  });

  it("passes correct text for each tableUtilBarButton", () => {
    const fetchTableData = jest.fn();
    const component = getComponent({
      fetchTableData,
      isAdmin: true,
      tableUtilBarButtons: mockTableButtonsTextArray,
    });

    const buttons = component.find(TableUtilBarButton);

    buttons.forEach(item => {
      const rightString = mockTableButtonsTextArray.find(
        string => string === item.props().children,
      );
      if (rightString && rightString.length) {
        expect(item.props().children).toEqual(rightString);
      }
    });
  });

  it("doesn't display buttons when user is not an admin", () => {
    const fetchTableData = jest.fn();
    const component = getComponent({
      fetchTableData,
      isAdmin: false,
      tableUtilBarButtons: mockTableButtonsTextArray,
    });
    expect(component.find(TableUtilBarButton)).not.toExist();
  });

  it("displays an error message when failed to fetch externalData", () => {
    const errors = [undefined, null];
    const fetchTableData = jest.fn();

    errors.forEach(async item => {
      fetchTableData.mockReturnValue(item);
      const component = await getComponent({fetchTableData});
      await expect(fetchTableData).toHaveBeenCalled();
      await component.update();
      expect(component.find(TableErrorMessage)).toExist();
      expect(component.find(InfiniteScrollList)).not.toExist();
      fetchTableData.mockClear();
    });
  });

  it("disables `Search` component when failed to fetch externalData", () => {
    const errors = [undefined, null];
    const fetchTableData = jest.fn();

    errors.forEach(async item => {
      fetchTableData.mockReturnValue(item);
      const component = await getComponent({fetchTableData});
      await expect(fetchTableData).toHaveBeenCalled();
      await component.update();
      expect(component.find(Search)).toHaveProp("disabled", true);
      fetchTableData.mockClear();
    });
  });

  it("doesn't render `tabs` when no tab array was passed", () => {
    const component = getComponent();

    expect(component.find(TabsContainer)).not.toExist();
  });

  it("renders `tabs` when they are being passed to the table, with the right props", () => {
    const component = getComponent({tabs});

    expect(component.find(TabsContainer)).toExist();
    const tabsArray = component.find(TabItem);
    tabsArray.forEach(item => {
      const rightString = tabsArray.find(
        string => string === item.prop("title"),
      );
      if (rightString && rightString.length) {
        expect(item.prop("title")).toEqual(rightString);
        expect(item.key()).toEqual(rightString);
      }
    });
  });

  test("each TabItem's `handleTabChange` triggers `fetchTableData`", () => {
    const fetchTableData = jest.fn();

    const component = getComponent({fetchTableData, tabs});
    const tabsArray = component.find(TabItem);
    tabsArray.forEach(async tab => {
      await tab.prop("onClick")();
      await expect(fetchTableData).toHaveBeenCalledTimes(1);
    });
  });

  test(
    "when `tabs` are passed, active tab is the tab with `0` index (first tab) from the start. hence, " +
      "pass corresponding `icon`, `action`, `actionIcon` to the `TableComponentItem`",
    () => {
      const props = getMockProps();
      props.tabs = tabs;
      const expectedProps = {
        theme: props.theme,
        globaltheme: props.globaltheme,
        isLoading: false,
        withImage: false,
        icon: "rent-passport",
        action: props.rowOnclickActions[0],
        actionIcon: "arrow-right",
      };

      const component = getComponent(props);
      component.find(InfiniteScrollList).prop("componentItem")();
      expect(TableComponentItem).toHaveBeenCalledWith(expectedProps);
    },
  );

  test(
    "when `tabs` are passed, active tab is the tab with `0` index (first tab) from the start. " +
      "when the second tab was clicked," +
      "pass corresponding `icon`, `action`, `actionIcon` to the `TableComponentItem`",
    async () => {
      const fakeData = [
        {
          id: "1",
          name: "East Leola",
          address: "22 Lansdowne Crescent, Notting Hill",
          properties: 111,
          users: 111,
          added: "2018-09-22T00:03:53.650Z",
        },
      ];
      const props = getMockProps();
      props.tabs = tabs;
      props.fetchTableData = jest.fn();
      props.fetchTableData.mockReturnValue(fakeData);

      const expectedProps = {
        theme: props.theme,
        globaltheme: props.globaltheme,
        isLoading: false,
        withImage: false,
        icon: "email-pending",
        action: props.rowOnclickActions[1],
        actionIcon: "close",
      };

      const component = await getComponent(props);
      const secondTab = await component
        .find(TabItem)
        .findWhere(tab => tab.prop("title") === "Pending");

      await secondTab.prop("onClick")();
      await component.update();
      await expect(props.fetchTableData).toHaveBeenCalled();

      await component.find(InfiniteScrollList).prop("componentItem")();
      await expect(TableComponentItem).toHaveBeenCalledWith(expectedProps);
    },
  );

  const getMockProps = () => ({
    tableHeaders: mockTableHeaders,
    theme: {},
    isAdmin: true,
    fetchTableData: () => {},
    globaltheme: "light",
    tableUtilBarButtons: [],
    withImage: false,
    searchProps,
    tabs: null,
    rowOnclickActionIcons,
    rowOnclickActions,
    rowIcons,
  });
  const getComponent = props => {
    const parsedProps = extend(getMockProps(), props);

    return shallow(<SortableTable {...parsedProps} />, {
      context: {store: mockStore(initialState)},
    });
  };
});
