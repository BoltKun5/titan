import React, {
  KeyboardEventHandler,
  useContext,
  useEffect,
  useState,
} from "react";
import { ClickAwayListener, Tooltip } from "@mui/material";
import { CategorizedAutocompleteChecklist } from "../CategorizedAutocompleteChecklist/CategorizedAutocompleteChecklist";
import "./style.scss";
import { frontRarity } from "../../pages/CardManager/CardManagerUtils";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { TextInputComponent } from "../UI/TextInputComponent/TextInputComponent";
import { ButtonComponent } from "../UI/Button/ButtonComponent";
import { CardManagerOptions } from "../CardManagerOptionsComponent/CardManagerOptionsComponent";
import {
  ArrowBackIosNew,
  ArrowForwardIos,
  Settings,
} from "@mui/icons-material";
import StoreContext from "../../hook/contexts/StoreContext";
import { SwipeCheckboxComponent } from "../UI/SwipeCheckboxComponent/SwipeCheckboxComponent";
import { Loader } from "../UI/Loader/LoaderComponent";
import { ICardSetFilter } from "../../local-core";
import useWindowDimensions from "../../hook/utils/useWindowDimensions";

export const CardManagerFilterComponent: React.FC<{
  hidePagination?: boolean;
}> = ({ hidePagination = false }) => {
  const { order, setOrder, pagination, setPage, page } =
    useContext(StoreContext);

  const {
    setCardSetFilter,
    setNameFilter,
    resetAllFilters,
    rarityFilter,
    cardSetFilter,
    nameFilter,
    possessionFilter,
    setPossessionFilter,
    setRarityFilter,
  } = useContext(StoreContext);

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState(false);

  const { width } = useWindowDimensions();

  const updateSetFilters = (event: any) => {
    if (!cardSetFilter) return;
    if (
      event.target.classList.contains(
        "CategorizedAutocompleteChecklist-dropdownElement"
      )
    ) {
      const id = event.target.getAttribute("id");
      const newSetFilterList = cardSetFilter.map(
        (setFilter: ICardSetFilter) => {
          if (setFilter.id === id) {
            setFilter.status = !setFilter.status;
          }
          return setFilter;
        }
      );
      setCardSetFilter(newSetFilterList);
    } else if (
      event.target.classList.contains("CategorizedAutocompleteChecklist-title")
    ) {
      const name = event.target.innerText;
      const areAllActivated =
        cardSetFilter.filter(
          (setFilter: ICardSetFilter) =>
            !setFilter.status && setFilter.category === name
        ).length === 0;
      setCardSetFilter(
        cardSetFilter.map((setFilter: ICardSetFilter) => {
          if (setFilter.category === name) {
            setFilter.status = !areAllActivated;
          }
          return setFilter;
        })
      );
    }
  };

  const updateRarityFilter = (rarity: string) => {
    setRarityFilter(
      rarityFilter.map((filter: any) => {
        if (filter.rarity === rarity) filter.value = !filter.value;
        return filter;
      })
    );
  };

  let nameInputTimer: number | undefined;

  const startCountdown = (event: any) => {
    clearTimeout(nameInputTimer);
    nameInputTimer = setTimeout(() => {
      setNameFilter(event.target.value);
    }, 300);
  };

  const getActiveFiltersList = () => {
    let allFilters = [];
    if (nameFilter && nameFilter !== "") {
      allFilters.push({
        text: "Nom : " + nameFilter,
        color: "$primary",
      });
    }
    if (cardSetFilter) {
      cardSetFilter.map((cardSet) => {
        if (cardSet.status) {
          allFilters.push({
            text: "Set : " + cardSet.name,
            color: "$primary",
          });
        }
      });
    }
    if (rarityFilter) {
      rarityFilter.map((rarityFilterElement) => {
        if (rarityFilterElement.value) {
          allFilters.push({
            text: "Rareté : " + frontRarity[rarityFilterElement.rarity],
            color: "$primary",
          });
        }
      });
    }
    return allFilters;
  };

  useEffect(() => {
    setPageNewValue(page);
  }, [page]);

  const [pageNewValue, setPageNewValue] = useState<any>(0);

  const setPageValue = (element: EventTarget & HTMLInputElement) => {
    const regex = new RegExp("^[0-9]+$");
    if (!regex.test(element.value)) {
      setPageNewValue(page);
      return;
    }
    const newValue = Number(element.value);
    if (newValue < 1 || newValue > (pagination?.totalPages ?? 0)) {
      setPageNewValue(page);
      return;
    }
    setPage(Number(element.value));
  };

  const changeHandler = (element: EventTarget & HTMLInputElement) => {
    setPageNewValue(element.value);
  };

  const nextPage = () => {
    if (!pagination) return;
    if (page + 1 > pagination.totalPages) return;
    setPage(page + 1);
  };

  const prevPage = () => {
    if (page === 1) return;
    setPage(page - 1);
  };

  // @ts-ignore
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (
    event: KeyboardEvent
  ) => {
    if (event.key === "Enter")
      // @ts-ignore
      event.currentTarget?.blur();
  };

  return !cardSetFilter ? (
    <Loader />
  ) : (
    <>
      {isFilterPanelOpen && (
        <div
          className="CardManagerFilter-blurFilter"
          onClick={() => setIsFilterPanelOpen(false)}
        />
      )}
      <div
        className={"CardManagerFilter" + (isFilterPanelOpen ? " blured" : "")}
        style={{
          transform: isFilterPanelOpen ? "" : "translateY(calc(-100% + 51px))",
        }}
      >
        <div className="CardManagerFilter-top">
          <div className="CardManagerFilter-fixedWidthContainer">
            <TextInputComponent
              width={width > 450 ? 368 : 310}
              label={"Nom"}
              id={"nameFilter"}
              onKeyUpCallback={startCountdown}
              onKeyDownCallback={() => clearTimeout(nameInputTimer)}
            />
          </div>
          <div className="CardManagerFilter-fixedWidthContainer">
            <div className="CardManagerFilter-selectInput">
              <label>Trier par</label>
              <div className="CardManagerFilter-selectInputOptions-container">
                <SwipeCheckboxComponent
                  callback={setOrder}
                  elements={[
                    {
                      name: "Set",
                      value: "default",
                    },
                    {
                      name: "Nom",
                      value: "name",
                    },
                    {
                      name: "Type",
                      value: "type",
                    },
                  ]}
                  value={order}
                  width={width > 450 ? 127 : 108}
                />
              </div>
            </div>
          </div>
          <div className="CardManagerFilter-fixedWidthContainer">
            <CategorizedAutocompleteChecklist
              items={cardSetFilter}
              placeholder={"Filtrer par sets"}
              onFilterChange={updateSetFilters}
              width={width > 450 ? 368 : 310}
            />
          </div>
          <div className="CardManagerFilter-fixedWidthContainer">
            <div className="CardManagerFilter-rarityFilter">
              <label>Filtrer par rareté</label>
              <div className="CardManagerFilter-rarityList">
                {rarityFilter.map((filter: any) => (
                  // @ts-ignore
                  <Tooltip
                    title={frontRarity[filter.rarity]}
                    key={"rarity" + filter.rarity}
                  >
                    <div
                      className={
                        "CardManagerFilter-rarityContainer " +
                        (filter.value ? "selected" : "")
                      }
                      onClick={() => {
                        updateRarityFilter(filter.rarity);
                      }}
                    >
                      <img
                        className="CardManagerFilter-rarityImg"
                        src={"./src/assets/icons/" + filter.rarity + ".png"}
                      />
                    </div>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
          <div className="CardManagerFilter-fixedWidthContainer">
            <div className="CardManagerFilter-htmlSelectInput">
              <label>Possession</label>
              <div className="CardManagerFilter-htmlSelectInput-container">
                <select
                  value={possessionFilter ?? "null"}
                  onChange={(ev) =>
                    setPossessionFilter(
                      ev.target.value !== "null"
                        ? (ev.target.value as any)
                        : null
                    )
                  }
                >
                  <option value={"null"}>Toutes</option>
                  <option value={"partial_owned"}>1+ version possédée</option>
                  <option value={"partial_unowned"}>
                    1+ version non possédée
                  </option>
                  <option value={"fully_owned"}>
                    Toutes versions possédées
                  </option>
                  <option value={"multiple_owned"}>
                    Exemplaires multiples
                  </option>
                  <option value={"unowned"}>Aucune version possédée</option>
                </select>
              </div>
            </div>
          </div>

          <div className="CardManagerFilter-fixedWidthContainer">
            <div
              className="CardManagerFilter-resetContainer"
              onClick={resetAllFilters}
            >
              <ButtonComponent label={"Réinitialiser"} />
            </div>
          </div>
        </div>
        <div className="CardManagerFilter-activeFilters">
          {pagination && !hidePagination && (
            <div className="CardManagerFilter-pagination">
              <div
                className={
                  "CardManagerFilter-paginationButton" +
                  (page === 1 ? "Disabled" : "")
                }
                onClick={() => prevPage()}
              >
                <ArrowBackIosNew />
              </div>
              <div className="CardManagerFilter-paginationInputContainer">
                <input
                  className="CardManagerFilter-paginationInput"
                  onBlur={(ev) => setPageValue(ev.currentTarget)}
                  onClick={(ev) => ev.currentTarget.select()}
                  value={pageNewValue}
                  type="number"
                  onChange={(ev) => changeHandler(ev.currentTarget)}
                  min={1}
                  onKeyDown={handleKeyDown}
                />
                <span> / {pagination.totalPages}</span>
              </div>
              <div
                className={
                  "CardManagerFilter-paginationButton" +
                  (page + 1 > pagination.totalPages ? "Disabled" : "")
                }
                onClick={() => nextPage()}
              >
                <ArrowForwardIos />
              </div>
            </div>
          )}
          <div className="CardManagerFilter-activeFiltersList">
            <span>Filtres actifs</span>
            {getActiveFiltersList().map((activeFilter) => (
              <div
                className="CardManagerFilter-activeFilter"
                key={activeFilter.text}
              >
                {activeFilter.text}
              </div>
            ))}
          </div>
          <div
            className="CardManagerFilter-openFilters"
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          >
            {<FilterAltIcon />}
          </div>
          <div className="CardManagerFilter-options">
            <div
              className="CardManagerFilter-openOptions"
              onClick={() => setIsOptionOpen(!isOptionOpen)}
            >
              <Settings />
            </div>
            {isOptionOpen && (
              <ClickAwayListener onClickAway={() => setIsOptionOpen(false)}>
                <div className="CardManagerFilter-optionsModale">
                  <CardManagerOptions />
                </div>
              </ClickAwayListener>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
