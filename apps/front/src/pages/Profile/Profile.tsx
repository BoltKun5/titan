import React, { useCallback, useContext, useEffect, useState } from "react";
import "./style.scss";
import StoreContext from "../../hook/contexts/StoreContext";
import { Delete, Edit } from "@mui/icons-material";
import { ButtonComponent } from "../../components/UI/Button/ButtonComponent";
import { useSnackbar } from "notistack";
import { isUnloggedPage } from "../../general.utils";
import { useFetchData } from "../../hook/api/cards";
import { Backdrop, Modal, Zoom } from "@mui/material";
import { TextInputComponent } from "../../components/UI/TextInputComponent/TextInputComponent";
import { AxiosResponse } from "axios";
import { IResponse } from "vokit_core";
import { loggedApi } from "../../axios";
import { useRelogin } from "../../hook/front/relogin";
import Joi from "joi";

export const Profile: React.FC = () => {
  const { user, tags, setTags, setUser } = useContext(StoreContext);
  const [modal, setModal] = useState<null | string>(null);
  const [labelToDelete, setLabelToDelete] = useState<null | string>(null);
  const { fetch } = useFetchData(isUnloggedPage());
  const [inputValue1, setInputValue1] = useState('')
  const [inputValue2, setInputValue2] = useState('')
  const { enqueueSnackbar } = useSnackbar();
  const { handleRelogin } = useRelogin();

  const copyShareLink = () => {
    navigator.clipboard.writeText(
      import.meta.env.VITE_BASE_URL + "/collection/" + user.id
    );
    enqueueSnackbar(
      "Le lien de partage de votre collection a été copié dans le presse-papier."
    );
  };

  const fetchTags = useCallback(async () => {
    if (user.id === '') return;
    const response = await fetch(`/tag`, {
      userId: user.id
    });
    setTags(response.data.tags);
  }, []);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    setInputValue1('');
    setInputValue2('');
  }, [modal]);

  const submit = async () => {
    try {
      let path, options;
      switch (modal) {
        case 'shownName': {
          path = 'update-shown-name';
          options = {
            shownName: inputValue1
          }
          break;
        }
        case 'password': {
          path = 'update-password';
          options = {
            password: inputValue1
          }
          break;
        }
        case 'profilePicture': {
          path = 'update-options';
          options = {
            profilePicture: inputValue1
          }
          break;
        }
      }
      const response: AxiosResponse<any> = await loggedApi.post(`/user/${path}`, options);
      setUser(response.data.user);
      setModal(null);
      enqueueSnackbar('Profil mis à jour.')
    } catch (e: any) {
      console.log(e)
      switch (e?.response?.data?.error?.code) {
        case 'UNAUTHORIZED':
        case 'EXPIRED_TOKEN': {
          handleRelogin();
        }
        default: {
          enqueueSnackbar('Une erreur inconnue est survenue.')
        }
      }
    }

  }

  const querySchema = Joi.object({
    inputValue1: Joi.string().min(5).required(),
    inputValue2: Joi.string().equal(inputValue1).required(),
  });

  const submitDeleteLabel = async () => {
    try {
      const response: AxiosResponse<any> = await loggedApi.delete(`/tag?id=${labelToDelete}`);
      setTags(response.data.data.tags);
      setLabelToDelete(null);
      enqueueSnackbar('Le label a été supprimé')
    } catch (e: any) {
      console.log(e)
      switch (e?.response?.data?.error?.code) {
        case 'UNAUTHORIZED':
        case 'EXPIRED_TOKEN': {
          handleRelogin();
          break;
        }
        default: {
          enqueueSnackbar('Une erreur inconnue est survenue.')
        }
      }
    }

  }

  return (
    <div className="Profile">
      <div className="Profile-data">
        <div className="Profile-profilePicture">
          <div className="Profile-profilePictureContainer" onClick={() => setModal('profilePicture')}>
            <img
              src={`/assets/profile_picture/${user?.options?.profilePicture ?? 1}.png`}
            />
          </div>
          <span>{user?.shownName}</span>
          <div className="Profile-editButton" onClick={() => setModal('shownName')}>
            <Edit />
          </div>
        </div>
        <div className="Profile-data-infos">
          <div>
            <h3>Adresse e-mail</h3>
            <span>{user?.mail}</span>
          </div>
          <div style={{ position: 'relative' }}>
            <h3>Mot de passe</h3>
            <span>*************</span>
            <div className="Profile-editButton" style={{ position: 'absolute', left: 110, top: 25 }} onClick={() => setModal('password')}>
              <Edit />
            </div>
          </div>
        </div>
      </div>

      <div className="Profile-buttons">
        <ButtonComponent label={"Copier le lien de partage"} weight={'normal'} fontSize={15} size={220} height={40} preset='primary' color="primary" hoverOffset={3} clipPath={10} callback={copyShareLink} />
      </div>

      <div className="Profile-tags">
        <h3>Labels</h3>
        <div className="Profile-tableContainer">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
              </tr>
            </thead>
            <tbody>
              {tags?.map((tag, index) => {
                return (
                  <tr key={"TagElement" + index}>
                    <td>{tag.name}
                      <div onClick={() => setLabelToDelete(tag.id)}>
                        <Delete />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!modal || !!labelToDelete}
        onClose={() => { setModal(null); setLabelToDelete(null); }}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          } as any,
        }}>
        <Zoom in={!!modal || !!labelToDelete} style={{ translate: 'calc(-50% - 1px) calc(-51%)' }}>
          <div className="Profile-modale coloredCorner">
            <div className="Profile-modale-paddingContainer">
              {
                modal === 'shownName' && <div className="Profile-modale-content">
                  <h3>Modifier le pseudonyme</h3>
                  <TextInputComponent
                    value={inputValue1}
                    modifyValue={setInputValue1}
                    label="Nouveau pseudonyme"
                    width={300}
                    preset="filter"
                    height={40}
                    labelAsPlaceholder={true}
                  />
                  <ButtonComponent size={70} label={"Valider"} clipPath={10} fontSize={16} height={40} callback={submit} />
                </div>
              }
              {
                modal === 'profilePicture' && <div className="Profile-modale-content">
                  <h3>Modifier la photo de profil</h3>
                  <span className="Profile-modale-link">proposées par <a href={'https://sprites.pmdcollab.org/'}>PMD Sprite Repository</a></span>
                  <div className="Profile-modale-pictureList">
                    {
                      (() => {
                        const array = [];
                        for (let i = 1; i <= 905; i++) {
                          array.push(<div className={"Profile-modale-picture" + (Number(inputValue1) === i ? (' ' + 'selected') : '')} onClick={() => setInputValue1(String(i))}>
                            <img src={`/assets/profile_picture/${i}.png`} />
                          </div>)
                        }
                        return array;
                      })()
                    }
                  </div>
                  <ButtonComponent size={70} label={"Valider"} disabled={inputValue1 === ''} clipPath={10} fontSize={16} height={40} callback={submit} />
                </div>
              }
              {
                modal === 'password' && <div className="Profile-modale-content password">
                  <h3>Modifier le mot de passe</h3>
                  <TextInputComponent
                    value={inputValue1}
                    modifyValue={setInputValue1}
                    label="Nouveau mot de passe"
                    width={300}
                    height={40}
                    labelAsPlaceholder={true}
                    type="password"
                    id="password"
                  />
                  <TextInputComponent
                    value={inputValue2}
                    modifyValue={setInputValue2}
                    label="Répéter le mot de passe"
                    width={300}
                    height={40}
                    type="password"
                    labelAsPlaceholder={true}
                    id="passwordValidation"
                  />
                  <ButtonComponent size={70} label={"Valider"} disabled={!!querySchema.validate({ inputValue1, inputValue2 })?.error} clipPath={10} fontSize={16} height={40} callback={submit} />
                </div>
              }
              {
                !!labelToDelete && <div className="Profile-modale-content password">
                  <h3>Supprimer un label</h3>
                  <span className="Profile-modale-tagWarning">Si vous supprimez ce label, il sera retiré de toutes vos possessions de cartes.</span>

                  <ButtonComponent size={90} label={"Supprimer"} clipPath={10} color="red" fontSize={16} height={40} callback={submitDeleteLabel} />
                </div>
              }
            </div>
          </div>
        </Zoom>
      </Modal>
    </div>
  );
};
