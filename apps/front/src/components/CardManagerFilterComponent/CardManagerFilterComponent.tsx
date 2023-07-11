import React, {
  KeyboardEventHandler,
  useContext,
  useEffect,
  useState,
} from "react";
import { ClickAwayListener, Fade, Tooltip } from "@mui/material";
import { CategorizedAutocompleteChecklist } from "../CategorizedAutocompleteChecklist/CategorizedAutocompleteChecklist";
import "./style.scss";
import { frontRarity, getFilterQuery, isUnloggedPage, isUserConnected } from "../../general.utils";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { TextInputComponent } from "../UI/TextInputComponent/TextInputComponent";
import { ButtonComponent } from "../UI/Button/ButtonComponent";
import {
  ArrowBackIosNew,
  ArrowForwardIos,
  List
} from "@mui/icons-material";
import StoreContext from "../../hook/contexts/StoreContext";
import { SwipeCheckboxComponent } from "../UI/SwipeCheckboxComponent/SwipeCheckboxComponent";
import { Loader } from "../UI/Loader/LoaderComponent";
import { ICardSetFilter } from "../../local-core";
import useWindowDimensions from "../../hook/utils/useWindowDimensions";
import { useParams, useSearchParams } from "react-router-dom";
import { SwitchInputComponent } from "../SwitchInputComponent/SwitchInputComponent";
import axios, { AxiosRequestTransformer } from "axios"

export const CardManagerFilterComponent: React.FC<{
  hidePagination?: boolean;
}> = ({ hidePagination = false }) => {
  const { order, setOrder, pagination, setPage, page } =
    useContext(StoreContext);
  const connected = isUserConnected();
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
    setListDisplay,
    listDisplay
  } = useContext(StoreContext);
  let [searchParams, setSearchParams] = useSearchParams();
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [listenToClose, setListenToClose] = useState(false);
  const [localNameFilter, setLocalNameFilter] = useState(nameFilter ?? '');
  const { width } = useWindowDimensions();

  let id: string | undefined = useParams().id;
  if (!isUnloggedPage()) {
    id = undefined;
  }

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

  useEffect(() => {
    setPageNewValue(page);
  }, [page]);

  useEffect(() => {
    const params = getFilterQuery(
      false,
      cardSetFilter ?? [],
      nameFilter,
      page,
      rarityFilter,
      possessionFilter,
      order,
      null
    );
    if (params.order === 'default') {
      delete params.order;
    }
    if (params.page === 1) {
      delete params.page;
    }
    setSearchParams(params)
  }, [
    cardSetFilter,
    nameFilter,
    page,
    rarityFilter,
    possessionFilter,
    order
  ])

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

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (
    event: any
  ) => {
    if (event.key === "Enter")
      event.currentTarget?.blur();
  };

  return !cardSetFilter ? (
    <Loader />
  ) : (
    <>
      <div className={"CardManagerFilter" + (hidePagination ? ' hidePagination' : '')} style={hidePagination ? { maxWidth: 'calc(100vw - 20px)', position: 'relative' } : {}}>
        <div className="CardManagerFilter-top">
          <div className="CardManagerFilter-topElements" style={hidePagination ? { maxWidth: 'none' } : {}}>
            {(
              <div
                className="CardManagerFilter-openFilters" style={{ marginLeft: 10 }}
                onClick={() => {
                  if (!isFilterPanelOpen) {
                    setIsFilterPanelOpen(true);
                    setTimeout(() => {
                      setListenToClose(true)
                    }, 100)
                  } else {
                    setIsFilterPanelOpen(false)
                    setListenToClose(false)
                  }
                }}
              >
                <FilterAltIcon />
              </div>
            )}
            {width > 500 && <div className="CardManagerFilter-fixedWidthContainer" style={{ width: 150 }}>
              <div
                className="CardManagerFilter-resetContainer"
                onClick={resetAllFilters}
              >
                <ButtonComponent label={"Réinitialiser"} size={150} height={40} clipPath={10} />
              </div>
            </div>}
            {
              width > 800 && <div className="CardManagerFilter-fixedWidthContainer" style={{ width: 250 }}>
                <TextInputComponent
                  label={"Nom"}
                  id={"nameFilter"}
                  value={localNameFilter}
                  modifyValue={setLocalNameFilter}
                  onKeyUpCallback={startCountdown}
                  onKeyDownCallback={() => clearTimeout(nameInputTimer)}
                  height={40}
                  preset={'filter'}
                />
              </div>
            }

            {width > 1030 && <div className="CardManagerFilter-fixedWidthContainer" style={{ width: 300 }}>
              <CategorizedAutocompleteChecklist
                items={cardSetFilter}
                placeholder={"Filtrer par sets"}
                onFilterChange={updateSetFilters}
                width={300}
              />
            </div>}
            {width > 1430 && <div className="CardManagerFilter-fixedWidthContainer" style={{ width: 'auto' }}>
              <div className="CardManagerFilter-rarityFilter">
                <label>Filtrer par rareté</label>
                <div className="CardManagerFilter-rarityList">
                  {rarityFilter.map((filter: any) => (
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
                          src={"/assets/icons/" + filter.rarity + ".png"}
                        />
                      </div>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </div>}
          </div>
          {pagination && !hidePagination && (<div className="CardManagerFilter-topPagination">
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
                  disabled={isUnloggedPage()}
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
            <div className="CardManagerFilter-listMod">
              <SwitchInputComponent value={listDisplay} isDisabled={false} modifyValue={setListDisplay} label={""} id={"listdisplay"} />
              <Tooltip title={'Mode liste'}>
                <List />
              </Tooltip>
            </div>
          </div>)}
        </div>
        <Fade in={isFilterPanelOpen}>
          <div>
            <ClickAwayListener onClickAway={() => { if (listenToClose) { setIsFilterPanelOpen(false); setListenToClose(false) } }}>
              <div className="CardManagerFilter-bottom">
                <>
                  <div className="CardManagerFilter-fixedWidthContainer" style={{ width: 250 }}>
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
                          preset='filter'
                          value={order}
                          width={80}
                        />
                      </div>
                    </div>
                  </div>
                  {(connected || id) && <div className="CardManagerFilter-fixedWidthContainer">
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
                          <option value={"unowned"}>Aucune version possédée</option>
                          <option value={"multiple_owned"}>
                            Exemplaires multiples
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>}

                  {width <= 800 && <div className="CardManagerFilter-fixedWidthContainer" style={{ width: 250, height: 40 }}>
                    <TextInputComponent
                      label={"Nom"}
                      id={"nameFilter"}
                      value={localNameFilter}
                      modifyValue={setLocalNameFilter}
                      onKeyUpCallback={startCountdown}
                      onKeyDownCallback={() => clearTimeout(nameInputTimer)}
                      height={40}
                      preset={'filter'}
                    />
                  </div>
                  }

                  {width <= 1030 && <div className="CardManagerFilter-fixedWidthContainer" style={{ width: 250, height: 40 }}>
                    <CategorizedAutocompleteChecklist
                      items={cardSetFilter}
                      placeholder={"Filtrer par sets"}
                      onFilterChange={updateSetFilters}
                      width={250}
                    />
                  </div>}
                  {width <= 1430 && <div className="CardManagerFilter-fixedWidthContainer CardManagerFilter-rarityFilterContainer" style={{ width: 'auto', height: 40 }}>
                    <div className="CardManagerFilter-rarityFilter">
                      <label>Filtrer par rareté</label>
                      <div className="CardManagerFilter-rarityList">
                        {rarityFilter.map((filter: any) => (
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
                                src={"/assets/icons/" + filter.rarity + ".png"}
                              />
                            </div>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  </div>}
                  {width <= 500 && <div className="CardManagerFilter-fixedWidthContainer" style={{ width: 150 }}>
                    <div
                      className="CardManagerFilter-resetContainer"
                      onClick={resetAllFilters}
                    >
                      <ButtonComponent label={"Réinitialiser"} size={150} height={40} clipPath={10} />
                    </div>
                  </div>}
                </>
              </div>
            </ClickAwayListener>
          </div>
        </Fade>
      </div >
    </>
  );
};
