import React from "react";
import {TableHeader, TableHeaderRow} from "./Table.styles";
import {AnimatedTrigger} from "../AnimatedTrigger";
import {ArrowLink} from "../common/layout";
import {array, func, string} from "prop-types";
export const TableHeaders = ({
  handleSort,
  checkColumnStyle,
  tableHeaders,
  globaltheme,
}) => (
  <TableHeaderRow>
    {tableHeaders.map(header => (
      <TableHeader key={header.id}>
        {header.name ? (
          <AnimatedTrigger
            show={checkColumnStyle(header.name)}
            globaltheme={globaltheme}
          >
            <ArrowLink
              inlineArrow
              columnActive={checkColumnStyle(header.name)}
              id={header.name}
              onClick={handleSort}
              globaltheme={globaltheme}
            >
              {header.name}
            </ArrowLink>
          </AnimatedTrigger>
        ) : (
          header.name
        )}
      </TableHeader>
    ))}
  </TableHeaderRow>
);
TableHeaders.propTypes = {
  handleSort: func,
  checkColumnStyle: func,
  tableHeaders: array,
  globaltheme: string,
};
