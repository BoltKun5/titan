import React, { useEffect, useState } from "react";
import { ClickAwayListener, TextField, Tooltip } from "@mui/material";
import "./style.scss";
import { TextInputComponent } from "../UI/TextInputComponent/TextInputComponent";
import ListIcon from "@mui/icons-material/List";
import { SetListComponent } from "../SetListComponent/SetListComponent";
import { ICardSetFilter } from "../../local-core";

type Props = {
  items: ICardSetFilter[];
  placeholder: string;
  onFilterChange: React.MouseEventHandler<HTMLElement>;
};

export const CategorizedAutocompleteChecklist: React.FC<Props> = ({
  items,
  placeholder,
  onFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isFastFilterOpen, setIsFastFilterOpen] = useState<boolean>(false);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

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

    const regex = new RegExp(/\s/g);
    const searchText = searchTerm.replace(regex, "").toLowerCase();
    const filteredItems = items.filter((item) => {
      const cleanLabel = item.name.replace(regex, "").toLowerCase();
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
        setIsFastFilterOpen(false);
      }
      setIsDropdownOpen(true);
    }
  };

  const closeDropdown = () => {
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

  return (
    <>
      <ClickAwayListener onClickAway={closeDropdown} mouseEvent={"onClick"}>
        <div className="CategorizedAutocompleteChecklist">
          {isFastFilterOpen && (
            <ClickAwayListener
              onClickAway={() => setIsFastFilterOpen(false)}
              mouseEvent={"onClick"}
            >
              <div>
                <SetListComponent />
              </div>
            </ClickAwayListener>
          )}

          <div
            className="CategorizedAutocompleteChecklist-searchBarContainer"
            onClick={openDropdown}
          >
            <TextInputComponent
              value={searchTerm}
              modifyValue={setSearchTerm}
              label="Filtrer par set"
              width={368}
            />
            <div className="CategorizedAutocompleteChecklist-fastFilterIcon">
              <Tooltip title="Filtres rapides">
                <ListIcon
                  onClick={(event) => {
                    setIsFastFilterOpen(!isFastFilterOpen);
                    event.stopPropagation();
                  }}
                />
              </Tooltip>
            </div>
          </div>

          <div
            className={
              "CategorizedAutocompleteChecklist-dropdown " +
              (isDropdownOpen ? "show" : "")
            }
          >
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
                      {item.name} ({item.code})
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </ClickAwayListener>
    </>
  );
};
