import React, {useEffect, useState} from "react";
import {ClickAwayListener, TextField} from "@mui/material";
import {CardSetFilterInterface} from "../../../api/src/local_core/types/types/interface/front";

type Props = {
  items: CardSetFilterInterface[],
  placeholder: string,
  onFilterChange: React.MouseEventHandler<HTMLElement>,
}

export const CategorizedAutocompleteChecklist: React.FC<Props> = ({items, placeholder, onFilterChange}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  useEffect(() => {
    updateFilteredItems(items);
  }, [searchTerm, items]);

  const updateFilteredItems = (propsItems: CardSetFilterInterface[]) => {
    if (!propsItems) {
      return [];
    }
    let items = [...propsItems];
    const isCategorySorted = items.find(element => element.category !== undefined) !== undefined;
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
      items = items.sort((a: CardSetFilterInterface, b) =>
        // @ts-ignore
        allCategories[a.category] - allCategories[b.category])
    }

    if (searchTerm === '') {
      setFilteredItems(manageCategoryTitles(items, allCategories));
      return
    }

    const regex = new RegExp(/\s/g);
    const searchText = searchTerm.replace(regex, '').toLowerCase();
    const filteredItems = items.filter((item) => {
      const cleanLabel = item.name.replace(regex, '').toLowerCase();
      return cleanLabel.includes(searchText);
    });
    setFilteredItems(manageCategoryTitles(filteredItems, allCategories));
  }

  const manageCategoryTitles = (itemsArray: any[], allCategories: string[]) => {
    if (Object.keys(allCategories).length === 0) {
      return itemsArray;
    }
    let index;
    Object.keys(allCategories).forEach((category: string) => {
      index = itemsArray.findIndex(element => element.category === category);
      if (index >= 0) {
        itemsArray.splice(index, 0, {title: category})
      }
    });
    return itemsArray;
  };

  const openDropdown = (event: any) => {
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  }

  const closeDropdown = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
      setSearchTerm("");
    }

  }

  const getTitleClassList = (item: CardSetFilterInterface) => {
    if (filteredItems.filter((filteredElement) => (item.title === filteredElement.category) && !filteredElement.status).length === 0) {
      return "AutocompleteCheck-title titleSelected"
    }
    return "AutocompleteCheck-title"
  }

  return <ClickAwayListener onClickAway={closeDropdown} mouseEvent={'onClick'}>
    <div className="AutocompleteCheck">
      <TextField
        fullWidth
        type="text"
        label={placeholder}
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        onClick={openDropdown}
        variant="outlined"
      >
      </TextField>
      <div className={"AutocompleteCheck-dropdown " + (isDropdownOpen ? 'show' : '')}>
        {
          filteredItems.map((item: CardSetFilterInterface, index: number) => {
            if (item.title) {
              return <div key={item.title + index.toString()}
                          className={getTitleClassList(item)}
                          onClick={onFilterChange}>{item.title}</div>
            } else {
              return <div key={item.id + index.toString()} onClick={onFilterChange}>
                <div id={item.id} className={"AutocompleteCheck-dropdown-element " + (item.status ? 'selected' : '')}>
                  {item.name}
                </div>
              </div>
            }
          })
        }
      </div>
    </div>
  </ClickAwayListener>

}
