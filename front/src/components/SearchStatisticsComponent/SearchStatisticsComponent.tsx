import React, { useContext, useState } from "react";
import CardManagerContext from "../../hook/contexts/CardManagerContext";
import './SearchStatisticsComponent.scss';
import { ClickAwayListener } from "@mui/material";
import { StatisticsDataType } from "../../../../api/src/local-core";
import { frontRarity } from "../../pages/CardManager/CardManagerUtils";
import { StatCardComponent } from "../StatCardComponent/StatCardComponent";
import { ResponsiveContainer, BarChart, RadialBarChart, XAxis, Tooltip, Bar, YAxis, RadialBar } from "recharts";

export const SearchStatisticsComponent: React.FC<{ data?: StatisticsDataType }> = (props) => {
  if (!props?.data) {
    return (<div />)
  }
  const data = props.data;
  const { setShowStats, showUnowned, cardSetFilter } = useContext(CardManagerContext);
  const [chartMode, setChartMode] = useState<"distinct" | "total" | string>("total");

  let localChartData: any[] = [];
  let localChartDistinctData: any[] = [];
  let localChartRadialData: any[] = [];

  for (let [key, value] of Object.entries(data.countBySet)) {
    if (value.totalNormal !== 0 || value.totalReverse !== 0)
      localChartData.push({
        Reverse: value.totalReverse,
        Normal: value.totalNormal,
        name: cardSetFilter.find((filter) => filter.code === key)?.name,
      })

    if (value.distinctReverse !== 0 || value.distinctNormal !== 0)
      localChartDistinctData.push({
        Reverse: value.distinctReverse,
        Normal: value.distinctNormal,
        name: cardSetFilter.find((filter) => filter.code === key)?.name,
      })

    if (value.distinctOwned !== 0 && value.distinctPossible !== 0) {
      localChartRadialData.push({
        values:
        {
          value: value.distinctOwned,
          max: value.distinctPossible,
        },
        name: cardSetFilter.find((filter) => filter.code === key)?.name,
      },
      )
    }
  }

  return (
    <div className="SearchStatistics">
      <ClickAwayListener onClickAway={() => setShowStats(false)}>
        <div className="SearchStatistics-modale">
          <div className="SearchStatistics-left">
            <div className={"SearchStatistics-radialCharts"}>
              {showUnowned &&
                localChartRadialData.map((data) => <div className={"SearchStatistics-radialContainer"}
                  key={"radialChart" + data.name}>
                  <div className="radial-graph">
                    <div className="shape">
                      <div className="mask full-mask"
                        style={{ transform: `rotate(${data.values.value / data.values.max * 360 / 2}deg)` }}>
                        <div className="fill"
                          style={{ transform: `rotate(${data.values.value / data.values.max * 360 / 2}deg)` }} />
                      </div>
                      <div className="mask">
                        <div className="fill"
                          style={{ transform: `rotate(${data.values.value / data.values.max * 360 / 2}deg)` }} />
                        <div className="fill shim"
                          style={{ transform: `rotate(${data.values.value / data.values.max * 360}deg)` }} />
                      </div>
                    </div>
                    <div className="cutout">
                    </div>
                  </div>
                  <div
                    className={"SearchStatistics-radialData"}><b>{Math.round(data.values.value / data.values.max * 100)}%</b> <br />{data.values.value} / {data.values.max}
                  </div>
                  <div className={"SearchStatistics-radialName"}>{data.name}</div>
                </div>,
                )
              }
            </div>

            <select onChange={(event) => setChartMode(event.target.value)} value={chartMode}>
              <option defaultChecked={true} value={"total"}>Total de cartes</option>
              <option value={"distinct"}>Cartes distinctes</option>
            </select>
            <div className="SearchStatistics-chart">
              <ResponsiveContainer width="100%"
                height={(chartMode === "total" ? localChartData.length : localChartDistinctData.length) * 50}>
                <BarChart
                  layout={"vertical"}
                  width={500}
                  height={300}
                  data={(chartMode === "total" ? localChartData : localChartDistinctData)}
                >
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip />
                  <Bar dataKey="Normal" fill="#d84432" />
                  <Bar dataKey="Reverse" fill="#2c2c2c" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="SearchStatistics-right">
            <div className="SearchStatistics-rightDatas">
              <StatCardComponent data={{
                label: "Cartes possédées",
                distinctQuantity: data.distinctOwned,
                ownedQuantity: data.totalOwned,
                possibleQuantity: data.distinctPossible,
              }
              } />
              <StatCardComponent data={{
                label: "Cartes normales possédées",
                distinctQuantity: data.distinctNormal,
                ownedQuantity: data.totalNormal,
                possibleQuantity: data.distinctNormalPossible,
              }
              } />
              <StatCardComponent data={{
                label: "Cartes reverse possédées",
                distinctQuantity: data.distinctReverse,
                ownedQuantity: data.totalReverse,
                possibleQuantity: data.distinctReversePossible,
              }
              } />
              {
                Object.entries(data.countByRarity).map(([rarity, rarityValues]) =>
                  <StatCardComponent key={"statCard" + rarity} data={{
                    // @ts-ignore
                    label: frontRarity[rarity],
                    distinctQuantity: rarityValues.distinctOwned,
                    ownedQuantity: rarityValues.totalOwned,
                    possibleQuantity: rarityValues.distinctPossible,
                    icon: 'src/assets/icons/' + rarity + '.png',
                  }} />)
              }
            </div>
          </div>
        </div>
      </ClickAwayListener>
    </div>
  )
}
