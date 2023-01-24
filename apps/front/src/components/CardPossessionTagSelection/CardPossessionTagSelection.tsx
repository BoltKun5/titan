import React, { useCallback, useContext, useEffect, useState } from "react";
import { ClickAwayListener, TextField, Tooltip } from "@mui/material";
import "./style.scss";
import StoreContext from "../../hook/contexts/StoreContext";
import { Add } from "@mui/icons-material";
import { loggedApi } from "../../axios";
import CardModalContext from "../../hook/contexts/CardModalContext";
import { IUserCardPossession, ITag } from "vokit_core";

type Props = {
  cardPossession: IUserCardPossession;
  onTagChange: Function;
};

export const CardPossessionTagSelection: React.FC<Props> = ({
  cardPossession,
  onTagChange,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  const { tags, setTags } = useContext(StoreContext);
  const { localCardPossession } = useContext(CardModalContext);

  useEffect(() => {
    if (!tags) return;
    updateFilteredItems();
  }, [searchTerm, tags]);

  const getLabelList = useCallback(() => {
    const tagList: ITag[] =
      localCardPossession?.find((poss) => poss.id === cardPossession.id)
        ?.tags ?? [];
    const idList = tagList?.map((subTag) => subTag.id);
    return tags?.filter((tag) => idList?.includes(tag.id))?.length ?? 0 > 0
      ? tags
          ?.filter((tag) => idList?.includes(tag.id))
          .map((e) => e.name)
          .join(", ")
      : "Rechercher ou créer";
  }, [tags, localCardPossession]);

  const updateFilteredItems = () => {
    if (!tags) return;

    let items = [...tags];

    const searchText = searchTerm.toUpperCase();
    let showCreate = true;
    const filteredItems = items.filter((item) => {
      const cleanLabel = item.name.toUpperCase();
      if (cleanLabel === searchText) showCreate = false;
      return cleanLabel.includes(searchText);
    });

    if (searchTerm === "") showCreate = false;

    setShowCreate(showCreate);
    if (filteredItems.length === 0) {
      setFilteredItems([{ id: "EMPTY" }]);
    } else {
      setFilteredItems(filteredItems);
    }
  };

  const createNewTag = async () => {
    try {
      const result = await loggedApi.post("/tag", {
        name: searchTerm,
      });
      setTags(result.data.data.tags);
    } catch (e) {
      console.log(e);
    }
  };

  const openDropdown = (event: any) => {
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };

  const closeDropdown = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
      setSearchTerm("");
    }
  };

  return (
    <>
      <ClickAwayListener onClickAway={closeDropdown} mouseEvent={"onClick"}>
        <div className="CardPossessionTagSelection">
          <div
            className="CardPossessionTagSelection-searchBarContainer"
            onClick={openDropdown}
          >
            <div className="CardPossessionTagSelection-inputContainer">
              <input
                type={"text"}
                value={searchTerm}
                placeholder={getLabelList()}
                onChange={(ev) => setSearchTerm(ev.target.value.toUpperCase())}
              ></input>
            </div>
          </div>

          <Tooltip title={"Créer le label " + searchTerm.toUpperCase()}>
            <div
              className={
                "CardPossessionTagSelection-createButton " +
                (showCreate ? "" : "disabled")
              }
              onClick={() => createNewTag()}
            >
              <Add />
            </div>
          </Tooltip>

          <div
            className={
              "CardPossessionTagSelection-dropdown " +
              (isDropdownOpen ? "show" : "")
            }
          >
            {filteredItems.map((item: ITag, index: number) => {
              if (item.id === "EMPTY") {
                return (
                  <div
                    key={item.id + index.toString()}
                    className={"CardPossessionTagSelection-emptyTagList"}
                  >
                    Aucun label
                  </div>
                );
              } else {
                return (
                  <div
                    key={item.id}
                    onClick={(ev) => {
                      onTagChange(item);
                      setShowCreate(showCreate);
                    }}
                  >
                    <div
                      className={
                        "CardPossessionTagSelection-dropdownElement " +
                        (localCardPossession
                          ?.find((poss) => poss.id === cardPossession.id)
                          ?.tags?.findIndex(
                            (tag: ITag) => tag.id === item.id
                          ) !== -1
                          ? "selected"
                          : "")
                      }
                    >
                      {item.name}
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
