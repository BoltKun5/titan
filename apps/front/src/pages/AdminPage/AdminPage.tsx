import React, { useCallback, useContext, useState } from "react";
import './style.scss'
import StoreContext from "../../hook/contexts/StoreContext";
import { AdminPageTabEnum } from "../../../../local-core";
import { DataImportComponent } from "../../components/AdminComponents/DataImportComponent";

export const AdminPage: React.FC = () => {

  const { user } = useContext(StoreContext);

  const [tab, setTab] = useState<AdminPageTabEnum>(0)

  const tabs = [
    {
      name: "Import de données",
      id: 1
    }
  ]

  return user.role !== 1 ? (
    <div className="AdminPage-401 coloredCorner">
      Accès refusé
    </div>
  ) : (
    <div className="AdminPage-container">
      <div className="AdminPage-content coloredCorner">
        <div className="AdminPage-tabSelection">
          {tabs.map((localTab) => (
            <div className="AdminPage-tab" key={localTab.id} onClick={() => setTab(localTab.id)} style={localTab.id === tab ? { backgroundColor: '#161827', width: 'calc(100% + 1px)' } : {}}>
              {localTab.name}
            </div>))}
        </div>
        <div className="AdminPage-component">
          {tab === AdminPageTabEnum.DATA_IMPORT && <DataImportComponent />}
        </div>
      </div>
    </div>
  )
};
