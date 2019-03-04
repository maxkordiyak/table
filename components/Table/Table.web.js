import React, {Component} from "react";
import {SitePageHeaderLeftContent, SitePageHeader} from "../common/layout";
import {
  TableUtilBarButton,
  TableErrorMessage,
  TabsContainer,
  TabItem,
} from "./Table.styles";
import {UtilsCommon, Tabs} from "frontend-common";
import {bool, func, array, object, string, arrayOf} from "prop-types";
import InfiniteScrollList from "../InfiniteScrollList";
import {TableComponentItem} from "./TableComponentItem";
import {TableHeaders} from "./TableHeaders";
import Search from "../Search";

/**
 * Sortable table component with searching, sorting, infinite scroll,
 * grouping by tab name, site page header,
 * auxiliary buttons to the right e.g `Create Property`
 *
 *
 * @isAdmin shows util bar buttons to the right e.g `Create Property`
 * @tableUtilBarButtons
 * @fetchTableData
 * @tableHeaders array needs to have {name: "", id: 0} and {name: "", id: lastId} in the beginning and at the end respectively
 * @withImage indicates the data has an image located at the beginning
 * @searchProps
 * @tabs optional e.g Shared / Pending
 * @rowIcons icons instead of an image fetched at the beginning
 * @rowOnclickActionIcons
 * @rowOnclickAction
 */

export class SortableTable extends Component {
  state = {
    externalData: [],
    error: false,
    order: "desc",
    selectedColumn: "name",
    isLoading: false,
    page: 1,
    limit: 10,
    query: "",
    status: "",
  };

  componentDidMount = async () => {
    const {tabs} = this.props;
    // first tab is active by default
    if (tabs) {
      await this.setState({
        status: tabs[0].title,
      });
    }

    this.loadAsyncData();
  };

  loadAsyncData = async param => {
    const {fetchTableData} = this.props;
    const {selectedColumn, order, query, page, limit, status} = this.state;
    await this.setState({
      isLoading: true,
    });
    const params = {
      search: query,
      order,
      orderBy: selectedColumn,
      page,
      limit,
      status: status.toLowerCase(),
    };

    let externalData;

    try {
      externalData = await fetchTableData({params});
    } catch (error) {
      this.setState({
        error: true,
      });
    }

    /**
     * the data needs to be updated when user sorts by a column name
     * so here we not just concatenate current data from server to the next data like we do in InfiniteScroll
     * we want a new set of data
     *
     */

    if (externalData === null || externalData === undefined) {
      this.setState({
        error: true,
      });
    }
    if (param === "sort" || param === "search" || param === "tab") {
      this.setState({externalData, isLoading: false});
    } else if (externalData) {
      this.setState(prevState => ({
        externalData: [...prevState.externalData, ...externalData],
        isLoading: false,
      }));
    }
  };

  handleSort = async event => {
    const selectedColumn = event.target.id;
    await this.setState(prevState => {
      return {
        page: 1,
        limit: 10,
        selectedColumn,
        order: prevState.order === "desc" ? "asc" : "desc",
      };
    });
    this.loadAsyncData("sort");
  };

  checkColumnStyle = columnName => {
    const {selectedColumn, order} = this.state;

    return order === "asc" && selectedColumn === columnName;
  };

  handleLoadMore = async () => {
    await this.setState({page: this.state.page + 1});
    this.loadAsyncData();
  };

  setFilterQuery = async query => {
    // page, limit are being reset to search among all the records
    await this.setState({query, page: null});
    this.loadAsyncData("search");
  };

  handleTabChange = async tabName => {
    await this.setState({
      status: tabName,
    });
    this.loadAsyncData("tab");
  };

  render() {
    const {
      theme,
      tableUtilBarButtons,
      isAdmin,
      tableHeaders,
      globaltheme,
      withImage,
      searchProps,
      tabs,
      rowIcons,
      rowOnclickActions,
      rowOnclickActionIcons,
    } = this.props;
    const {externalData, isLoading, limit, error, status} = this.state;

    const activeTab =
      (tabs && tabs.findIndex(tab => tab.title === status)) || 0;

    const componentProps = {
      theme,
      globaltheme,
      isLoading,
      withImage,
      icon: rowIcons && rowIcons[activeTab],
      action: rowOnclickActions && rowOnclickActions[activeTab],
      actionIcon: rowOnclickActionIcons && rowOnclickActionIcons[activeTab],
    };

    let errorMessage = null;
    if (error) {
      errorMessage = <TableErrorMessage>No data available.</TableErrorMessage>;
    }

    return (
      <div>
        <SitePageHeader>
          <Search
            {...searchProps}
            setFilterQuery={this.setFilterQuery}
            disabled={error}
          />

          {isAdmin && (
            <SitePageHeaderLeftContent>
              {tableUtilBarButtons.map(utilButton => (
                <TableUtilBarButton
                  key={utilButton.text}
                  theme={theme}
                  middle={utilButton.text}
                  type={utilButton.type}
                  onClick={() => utilButton.action()}
                />
              ))}
            </SitePageHeaderLeftContent>
          )}
        </SitePageHeader>
        {tabs && (
          <TabsContainer>
            <Tabs>
              {tabs.map(tabItem => (
                <TabItem
                  key={tabItem.title}
                  title={tabItem.title}
                  onClick={() => this.handleTabChange(tabItem.title)}
                />
              ))}
            </Tabs>
          </TabsContainer>
        )}
        {errorMessage}

        {!errorMessage && (
          <InfiniteScrollList
            componentItem={item =>
              TableComponentItem(Object.assign(componentProps, item))
            }
            data={externalData}
            displayListHeaders={TableHeaders}
            listHeaders={tableHeaders}
            globaltheme={globaltheme}
            theme={theme}
            checkColumnStyle={this.checkColumnStyle}
            handleSort={this.handleSort}
            loadMore={this.handleLoadMore}
            limit={limit}
          />
        )}
      </div>
    );
  }
}
SortableTable.propTypes = {
  isAdmin: bool.isRequired,
  fetchTableData: func.isRequired,
  tableHeaders: array.isRequired,
  tableUtilBarButtons: array,
  withImage: bool,
  searchProps: object.isRequired,
  tabs: array,
  rowIcons: arrayOf(string),
  rowOnclickActionIcons: arrayOf(string.isRequired),
  rowOnclickActions: arrayOf(func.isRequired),
};
export default UtilsCommon.themed(SortableTable);
