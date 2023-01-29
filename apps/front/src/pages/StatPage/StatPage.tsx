import "./style.scss";
import { frontRarity, getFilterQuery } from "../CardManager/CardManagerUtils";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  Tooltip,
  Bar,
  YAxis,
} from "recharts";
import StoreContext from "../../hook/contexts/StoreContext";
import { StatCardComponent } from "../../components/StatCardComponent/StatCardComponent";
import { CardManagerFilterComponent } from "../../components/CardManagerFilterComponent/CardManagerFilterComponent";
import { SwipeCheckboxComponent } from "../../components/UI/SwipeCheckboxComponent/SwipeCheckboxComponent";
import { useState, useContext, useCallback, useEffect } from "react";
import { useFetchData } from "../../hook/api/cards";
import { CardRarityEnum, StatisticsDataType } from "vokit_core";
import useWindowDimensions from "../../hook/utils/useWindowDimensions";

export const StatPage: React.FC = () => {
  const [stats, setStats] = useState<StatisticsDataType | null>(null);
  const {
    nameFilter,
    rarityFilter,
    collectionMode,
    cardSetFilter,
    possessionFilter,
    order,
    page,
  } = useContext(StoreContext);
  const { width } = useWindowDimensions();
  const { isLoading, fetch } = useFetchData();
  const [chartMode, setChartMode] = useState<"distinct" | "total" | string>(
    "total"
  );

  const fetchStats = useCallback(async () => {
    if (!cardSetFilter) return;
    const params = getFilterQuery(
      true,
      cardSetFilter,
      nameFilter,
      page,
      rarityFilter,
      possessionFilter
    );
    const response = await fetch("/card/stats", params);
    setStats((response as any).data.stats);
  }, [
    cardSetFilter,
    nameFilter,
    collectionMode,
    possessionFilter,
    order,
    page,
  ]);

  useEffect(() => {
    fetchStats();
  }, [
    cardSetFilter,
    nameFilter,
    collectionMode,
    possessionFilter,
    order,
    rarityFilter,
  ]);

  const data = stats;
  if (!data) return <></>;

  let localChartData: any[] = [];
  let localChartDistinctData: any[] = [];
  let localChartRadialData: any[] = [];

  for (let [key, value] of Object.entries(data.countBySet)) {
    if (value.totalNormal !== 0 || value.totalReverse !== 0)
      localChartData.push({
        Reverse: value.totalReverse,
        Normal: value.totalNormal,
        name: cardSetFilter?.find((filter) => filter.code === key)?.name,
      });

    if (value.distinctReverse !== 0 || value.distinctNormal !== 0)
      localChartDistinctData.push({
        Reverse: value.distinctReverse,
        Normal: value.distinctNormal,
        name: cardSetFilter?.find((filter) => filter.code === key)?.name,
      });

    if (value.distinctOwned !== 0 && value.distinctPossible !== 0) {
      localChartRadialData.push({
        values: {
          value: value.distinctOwned,
          max: value.distinctPossible,
        },
        name: cardSetFilter?.find((filter) => filter.code === key)?.name,
      });
    }
  }

  return (
    <>
      <CardManagerFilterComponent hidePagination={true} />
      <div className="StatPage">
        <div className="StatPage-left">
          <div className="StatPage-mainChartContainer coloredCorner">
            <div className="StatPage-mainChart">
              <div className="StatPage-swipe">
                <SwipeCheckboxComponent
                  callback={setChartMode}
                  elements={[
                    {
                      value: "total",
                      name: "Toutes les cartes",
                    },
                    {
                      value: "distinct",
                      name: "Cartes distinctes",
                    },
                  ]}
                  value={chartMode}
                  width={width > 500 ? 200 : 135}
                />
              </div>
              <div className="StatPage-chart">
                <ResponsiveContainer
                  width="100%"
                  height={
                    (chartMode === "total"
                      ? localChartData.length
                      : localChartDistinctData.length) *
                      50 +
                    30
                  }
                >
                  <BarChart
                    layout={"vertical"}
                    width={200}
                    height={300}
                    data={
                      chartMode === "total"
                        ? localChartData
                        : localChartDistinctData
                    }
                  >
                    <XAxis type="number" />
                    <YAxis
                      type="category"
                      dataKey="name"
                      style={{
                        fontSize: "12px",
                      }}
                      width={width > 500 ? 150 : 90}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#161827",
                        border: "1px solid #292929",
                      }}
                      labelStyle={{ color: "#c9c9c9" }}
                    />
                    <Bar dataKey="Normal" fill="#FFF" />
                    <Bar dataKey="Reverse" fill="#3b99f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="StatPage-radialChartsContainer coloredCorner">
            <div className={"StatPage-radialCharts"}>
              {localChartRadialData.map((data) => (
                <div
                  className={"StatPage-radialContainer"}
                  key={"radialChart" + data.name}
                >
                  <div className="radial-graph">
                    <div className="shape">
                      <div
                        className="mask full-mask"
                        style={{
                          transform: `rotate(${
                            ((data.values.value / data.values.max) * 360) / 2
                          }deg)`,
                        }}
                      >
                        <div
                          className="fill"
                          style={{
                            transform: `rotate(${
                              ((data.values.value / data.values.max) * 360) / 2
                            }deg)`,
                          }}
                        />
                      </div>
                      <div className="mask">
                        <div
                          className="fill"
                          style={{
                            transform: `rotate(${
                              ((data.values.value / data.values.max) * 360) / 2
                            }deg)`,
                          }}
                        />
                        <div
                          className="fill shim"
                          style={{
                            transform: `rotate(${
                              (data.values.value / data.values.max) * 360
                            }deg)`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="cutout"></div>
                  </div>
                  <div className={"StatPage-radialData"}>
                    <b>
                      {Math.round((data.values.value / data.values.max) * 100)}%
                    </b>{" "}
                    <br />
                    {data.values.value} / {data.values.max}
                  </div>
                  <div className={"StatPage-radialName"}>{data.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="StatPage-right coloredCorner">
          <div className="StatPage-rightDatas">
            <StatCardComponent
              data={{
                label: "Toutes possédées",
                distinctQuantity: data.distinctOwned,
                ownedQuantity: data.totalOwned,
                possibleQuantity: data.distinctPossible,
                icon: "src/assets/icons/collection.png",
              }}
            />
            <StatCardComponent
              data={{
                label: "Normales possédées",
                distinctQuantity: data.distinctNormal,
                ownedQuantity: data.totalNormal,
                possibleQuantity: data.distinctNormalPossible,
                icon: "src/assets/icons/normales.png",
              }}
            />
            <StatCardComponent
              data={{
                label: "Reverse possédées",
                distinctQuantity: data.distinctReverse,
                ownedQuantity: data.totalReverse,
                possibleQuantity: data.distinctReversePossible,
                icon: "src/assets/icons/reverses.png",
              }}
            />
            {Object.entries(data.countByRarity).map(
              ([rarity, rarityValues]) => (
                <StatCardComponent
                  key={"statCard" + rarity}
                  data={{
                    label: frontRarity[rarity] + "s",
                    distinctQuantity: rarityValues.distinctOwned,
                    ownedQuantity: rarityValues.totalOwned,
                    possibleQuantity: rarityValues.distinctPossible,
                    icon: "src/assets/icons/" + rarity + ".png",
                  }}
                />
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};
