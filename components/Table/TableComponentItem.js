import React from "react";
import {
  ArrowIcon,
  RowIcon,
  TableData,
  TableDataRow,
  TableDataText,
  TableDataImage,
} from "./Table.styles";
import {uniqueId} from "underscore";
import employment from "../../assets/images/employment.svg";
import rentPassport from "../../assets/images/rent-passport.svg";
import emailPending from "../../assets/images/email-pending.svg";
import {StringUtils} from "frontend-common";
import {object, bool, string, func} from "prop-types";
const getRowIcon = iconName => {
  switch (iconName) {
    case "employment":
      return employment;
    case "rent-passport":
      return rentPassport;
    case "email-pending":
      return emailPending;
    default:
      return employment;
  }
};

/**
 *
 * @item the row to be rendered
 * @theme theme
 * @isLoading adds opacity to the component
 * @withImage indicates that item has an image
 * @icon icon before the row columns (add an extra empty column in tableHeaders for it)
 * @action function to be triggered when the row was clicked
 * @actionIcon icon to the right of the row e.g "arrow-right"
 */

export const TableComponentItem = ({
  item,
  theme,
  isLoading,
  withImage,
  icon,
  action,
  actionIcon,
}) => {
  return (
    <TableDataRow key={uniqueId()} enableOpacity={isLoading}>
      {!withImage && (
        <TableData>
          <RowIcon src={getRowIcon(icon)} />
        </TableData>
      )}
      {Object.entries(item).map(
        ([key, value]) =>
          key !== "id" && (
            <TableData
              key={uniqueId()}
              data-label={StringUtils.capitalizeFirstLetter(key)}
            >
              {key === "image" ? (
                <TableDataImage src={item.image} />
              ) : (
                <TableDataText truncateText={key === "address"}>
                  {key === "added"
                    ? new Date(value).toLocaleDateString()
                    : value}
                </TableDataText>
              )}
            </TableData>
          ),
      )}
      <TableData>
        <ArrowIcon
          theme={theme}
          name={actionIcon || "arrow-right"}
          type="transparent_gray"
          iconsize={36}
          onClick={() => action(item)}
        />
      </TableData>
    </TableDataRow>
  );
};
TableComponentItem.propTypes = {
  item: object.isRequired,
  theme: object.isRequired,
  isLoading: bool,
  icon: string,
  action: func.isRequired,
  actionIcon: string,
  withImage: bool,
};
