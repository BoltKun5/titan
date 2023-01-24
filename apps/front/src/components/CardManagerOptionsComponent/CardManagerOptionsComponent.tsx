import React, { useContext } from "react";

import "./style.scss";
import { SwitchInputComponent } from "../SwitchInputComponent/SwitchInputComponent";
import StoreContext from "../../hook/contexts/StoreContext";

export const CardManagerOptions: React.FC = () => {
  const {
    collectionMode,
    setCollectionMode,
    separateReverse,
    setSeparateReverse,
    showOptionCards,
    setShowOptionCards,
  } = useContext(StoreContext);

  return (
    <>
      <div className="CardManagerOptions coloredCorner">
        <div className="CardManagerOptions-triangleContainer">
          <div className="CardManagerOptions-triangle" />
        </div>
        {/* <SwitchInputComponent
          value={collectionMode}
          isDisabled={false}
          modifyValue={setCollectionMode}
          label={"Mode Collection"}
          id={"collectionMode"}
        /> */}
        {/* <SwitchInputComponent
          value={separateReverse}
          isDisabled={!collectionMode}
          modifyValue={setSeparateReverse}
          label={'Séparer Reverse'}
          id={'separateReverse'}
        /> */}
        <SwitchInputComponent
          value={showOptionCards}
          isDisabled={!collectionMode}
          modifyValue={setShowOptionCards}
          label={"Afficher cartes outils"}
          id={"showOptionCards"}
        />
      </div>
    </>
  );
};
