import React, { useContext, useEffect, useState } from "react";
import {
  ClickAwayListener,
  Modal,
  Popover,
  Popper,
  TextField,
  Tooltip,
} from "@mui/material";
import "./style.scss";
import { TextInputComponent } from "../UI/TextInputComponent/TextInputComponent";
import ListIcon from "@mui/icons-material/List";
import { SetListComponent } from "../SetListComponent/SetListComponent";
import { ICardSetFilter } from "../../local-core";
import StoreContext from "../../hook/contexts/StoreContext";

type Props = {
  items: ICardSetFilter[];
  placeholder: string;
  onFilterChange: React.MouseEventHandler<HTMLElement>;
  width?: number;
};

export const CategorizedAutocompleteChecklist: React.FC<Props> = ({
  items,
  placeholder,
  onFilterChange,
  width = 368,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<
    null | (HTMLElement | null | undefined)
  >(null);
  const { cardSetFilter } = useContext(StoreContext);
  const isFastFilterOpen = Boolean(anchorEl);

  useEffect(() => {
    updateFilteredItems(items);
  }, [searchTerm, items]);

  const updateFilteredItems = (propsItems: ICardSetFilter[]) => {
    if (!propsItems) {
      return [];
    }
    let items = [...propsItems];
    const isCategorySorted =
      items.find((element) => element.category !== undefined) !== undefined;
    let allCategories: any[] = [];
    if (isCategorySorted) {
      let i = 1;
      items.forEach((item) => {
        if (!item.category) {
          item.category = "default";
        }
        if (!(item.category in allCategories)) {
          // @ts-ignore
          allCategories[item.category] = i;
          i++;
        }
      });
      items = items.sort(
        (a: ICardSetFilter, b) =>
          // @ts-ignore
          allCategories[a.category] - allCategories[b.category]
      );
    }

    if (searchTerm === "") {
      setFilteredItems(manageCategoryTitles(items, allCategories));
      return;
    }

    console.log(items)

    const regex = new RegExp(/\s/g);
    const searchText = searchTerm.replace(regex, "").toLowerCase();
    const filteredItems = items.filter((item) => {
      if (!item?.name) return false;
      const cleanLabel = item?.name?.replace(regex, "").toLowerCase();
      return cleanLabel.includes(searchText);
    });
    setFilteredItems(manageCategoryTitles(filteredItems, allCategories));
  };

  const manageCategoryTitles = (itemsArray: any[], allCategories: string[]) => {
    if (Object.keys(allCategories).length === 0) {
      return itemsArray;
    }
    let index;
    Object.keys(allCategories).forEach((category: string) => {
      index = itemsArray.findIndex((element) => element.category === category);
      if (index >= 0) {
        itemsArray.splice(index, 0, { title: category });
      }
    });
    return itemsArray;
  };

  const openDropdown = (event: any) => {
    if (!isDropdownOpen) {
      if (isFastFilterOpen) {
        setAnchorEl(null);
      }
      setIsDropdownOpen(true);
    }
    event.stopPropagation();
  };

  const closeDropdown = (ev: any) => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
      setSearchTerm("");
    }
  };

  const getTitleClassList = (item: ICardSetFilter) => {
    if (
      filteredItems.filter(
        (filteredElement) =>
          item.title === filteredElement.category && !filteredElement.status
      ).length === 0
    ) {
      return "CategorizedAutocompleteChecklist-title selected";
    }
    return "CategorizedAutocompleteChecklist-title";
  };

  const getFixedPositionStyle = (): { top: string; left: string } => {
    const v = document
      .querySelector(".CategorizedAutocompleteChecklist")
      ?.getBoundingClientRect();

    if (!v) return { top: "", left: "" };

    return { top: `${v.y + v.height - 18}px`, left: `${v.x}px` };
  };

  return (
    <>
      <ClickAwayListener onClickAway={closeDropdown} mouseEvent={"onClick"}>
        <>
          <div className="CategorizedAutocompleteChecklist">
            <div
              className="CategorizedAutocompleteChecklist-searchBarContainer"
              onClick={openDropdown}
            >
              <TextInputComponent
                value={searchTerm}
                modifyValue={setSearchTerm}
                label="Filtrer par extension"
                placeholder={cardSetFilter?.filter(e => e.status).map((e) => e.name).join(', ')}
                width={width}
                preset="filter"
                height={40}
              />
              {/* <div className="CategorizedAutocompleteChecklist-fastFilterIcon">
                <Tooltip title="Filtres rapides">
                  <ListIcon
                    onClick={(event) => {
                      setAnchorEl(
                        anchorEl
                          ? null
                          : event.currentTarget.parentElement?.parentElement
                      );
                      event.stopPropagation();
                    }}
                  />
                </Tooltip>
              </div> */}
            </div>
            <ClickAwayListener
              onClickAway={closeDropdown}
              mouseEvent={"onClick"}
            >
              <div
                className={
                  "CategorizedAutocompleteChecklist-dropdown " +
                  (isDropdownOpen ? "show" : "")
                }
                style={{ width: width, ...getFixedPositionStyle() }}
              >
                <>
                  {filteredItems.map((item: ICardSetFilter, index: number) => {
                    if (item.title) {
                      return (
                        <div
                          key={item.title + index.toString()}
                          className={getTitleClassList(item)}
                          onClick={(ev) => onFilterChange(ev)}
                        >
                          {item.title}
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={item.id + index.toString()}
                          onClick={(ev) => onFilterChange(ev)}
                        >
                          <div
                            id={item.id}
                            className={
                              "CategorizedAutocompleteChecklist-dropdownElement " +
                              (item.status ? "selected" : "")
                            }
                          >
                            <img src={item.logoId} />{item.name}
                          </div>
                        </div>
                      );
                    }
                  })}
                </>
              </div>
            </ClickAwayListener>
          </div>
          <Popover
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={isFastFilterOpen}
            anchorEl={anchorEl}
          >
            <ClickAwayListener
              onClickAway={() => setAnchorEl(null)}
              mouseEvent={"onClick"}
            >
              <div>
                <SetListComponent />
              </div>
            </ClickAwayListener>
          </Popover>
        </>
      </ClickAwayListener>
    </>
  );
};
