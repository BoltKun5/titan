import React, { useContext } from "react";
import CardManagerContext from "../../hook/contexts/CardManagerContext";
import './style.scss';
import { SwitchInputComponent } from "../SwitchInputComponent/SwitchInputComponent";

export const CardManagerOptions: React.FC = () => {
  const {
    collectionMode,
    setCollectionMode,
    separateReverse,
    setSeparateReverse,
    showUnowned,
    setShowUnowned,
    showOptionCards,
    setShowOptionCards
  } = useContext(CardManagerContext);

  return (
    <>
      <div className="CardManagerOptions coloredCorner">
        <div className="CardManagerOptions-triangleContainer">
          <div className="CardManagerOptions-triangle" />
        </div> <SwitchInputComponent
          value={collectionMode}
          isDisabled={false}
          modifyValue={setCollectionMode}
          label={'Mode Collection'}
          id={'collectionMode'}
        />
        <SwitchInputComponent
          value={separateReverse}
          isDisabled={!collectionMode}
          modifyValue={setSeparateReverse}
          label={'Séparer Reverse'}
          id={'separateReverse'}
        />
        <SwitchInputComponent
          value={showUnowned}
          isDisabled={!collectionMode}
          modifyValue={setShowUnowned}
          label={'Afficher non possédées'}
          id={'showUnowned'}
        />
        <SwitchInputComponent
          value={showOptionCards}
          isDisabled={!collectionMode}
          modifyValue={setShowOptionCards}
          label={'Afficher cartes outils'}
          id={'showOptionCards'}
        />
      </div>
    </>
  )

}
