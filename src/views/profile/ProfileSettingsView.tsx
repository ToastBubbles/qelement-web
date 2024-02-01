import { useContext, useState } from "react";
import { AppContext } from "../../context/context";
import axios from "axios";
import { useMutation, useQuery } from "react-query";
import {
  IAPIResponse,
  IUserDTO,
  IUserPrefDTO,
  color,
  iIdOnly,
} from "../../interfaces/general";
import LoadingPage from "../../components/LoadingPage";
import showToast, { Mode, formatDate } from "../../utils/utils";
import SliderToggle from "../../components/SliderToggle";
import MyToolTip from "../../components/MyToolTip";
import SliderToggle2 from "../../components/SliderToggle2";
import { Types } from "../../context/userPrefs/reducer";
import { UserPrefPayload } from "../../context/userPrefs/context";
import ColorLink from "../../components/ColorLink";
import GenericPopup from "../../components/GenericPopup";
import ColorTextField from "../../components/ColorTextField";
enum ColName {
  TLG = "tlg",
  BL = "bl",
  BO = "bo",
}
enum ColId {
  TLG = "tlg",
  BL = "bl",
  BO = "bo",
  QE = "qe",
}

export default function ProfileSettingsView() {
  const {
    state: {
      jwt: { token, payload },
    },
    dispatch,
  } = useContext(AppContext);

  const [wantedVisible, setWantedVisible] = useState<boolean>(true);
  const [collectionVisible, setCollectionVisible] = useState<boolean>(true);
  const [lang, setLang] = useState<string>("en");
  const [allowMessages, setAllowMessages] = useState<boolean>(true);
  const [showColorUpdater, setShowColorUpdater] = useState<boolean>(false);
  const [newFaveColorId, setNewFaveColorId] = useState<number>(-1);
  const [prefColorName, setPrefColorName] = useState<ColName>(ColName.BL);
  const [prefColorId, setPrefColorId] = useState<ColId>(ColId.TLG);
  const { data } = useQuery({
    queryKey: `user${payload.id}`,
    queryFn: () =>
      axios.get<IUserDTO>(`http://localhost:3000/user/id/${payload.id}`),
    onSuccess(res) {
      setAllowMessages(res.data.preferences.allowMessages);
      setCollectionVisible(res.data.preferences.isCollectionVisible);
      setWantedVisible(res.data.preferences.isWantedVisible);
      setLang(res.data.preferences.lang);
      setPrefColorName(res.data.preferences.prefName as ColName);
      setPrefColorId(res.data.preferences.prefId as ColId);
    },
    enabled: !!payload.id,
  });
  const userPrefMutation = useMutation({
    mutationFn: (userPrefs: IUserPrefDTO) =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/userPreference/userId/${payload.id}`,
        userPrefs,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast("Changes saved!", Mode.Success);
        console.log(e.data.message);
        dispatch({
          type: Types.SetPrefs,
          payload: {
            prefPayload: {
              lang: lang,
              isCollectionVisible: collectionVisible,
              isWantedVisible: wantedVisible,
              allowMessages: allowMessages,
              prefName: prefColorName,
              prefId: prefColorId,
            } as unknown as UserPrefPayload,
          },
        });
      }
    },
  });

  const faveColorMutation = useMutation({
    mutationFn: (colorId: iIdOnly) =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/user/favoriteColor`,
        colorId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast(
          "Color saved! Changes will reflect on page refresh, don't forget to save any other changes you may have made first!",
          Mode.Success
        );
        closePopUp();
        console.log(e.data.message);
      }
    },
  });

  if (data) {
    const me = data.data;
  

    function checkForChanges(): boolean {
      let hasChanges = false;
      if (me.preferences.allowMessages != allowMessages) {
        hasChanges = true;
      }
      if (me.preferences.isWantedVisible != wantedVisible) {
        hasChanges = true;
      }
      if (me.preferences.isCollectionVisible != collectionVisible) {
        hasChanges = true;
      }
      if (me.preferences.lang != lang) {
        hasChanges = true;
      }
      if (me.preferences.prefName != (prefColorName as string)) {
        hasChanges = true;
      }
      if (me.preferences.prefId != (prefColorId as string)) {
        hasChanges = true;
      }

      return hasChanges;
    }
    return (
      <>
        <div className="formcontainer">
          <h1>Settings</h1>
          <div className="mainform jc-space-b" style={{ height: "30em" }}>
            <div className="w-100 d-flex jc-space-b">
              <div>Username:</div>
              <div>{payload.username}</div>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <div>Email:</div>
              <div>{me.email}</div>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <div>Role:</div>
              <div>{me.role}</div>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <div>Date Joined:</div>
              <div>{formatDate(me.createdAt)}</div>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <div>Allow others to Send Me Messages</div>
              <div>
                <SliderToggle2
                  getter={allowMessages}
                  setter={setAllowMessages}
                />
              </div>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <div>Allow others to see my Wanted Lists</div>
              <div>
                <SliderToggle2
                  getter={wantedVisible}
                  setter={setWantedVisible}
                />
              </div>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <div>Allow others to see my Collection</div>
              <div>
                <SliderToggle2
                  getter={collectionVisible}
                  setter={setCollectionVisible}
                />
              </div>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <div>
                Preferred Color Name{" "}
                <MyToolTip
                  id="colNameTip"
                  content={
                    <div style={{ maxWidth: "20em" }}>
                      <div>
                        Which color name to display when navigating this site.
                        If a name is not available for the selected preference,
                        it will fallback to the next best option and add an
                        asterisk (*). i.e. If there is no Bricklink name
                        available, the TLG name will be displayed instead.
                      </div>
                      <div>
                        <ul>
                          <li>TLG = The LEGO Group</li>
                          <li>BL = Bricklink</li>
                          <li>BO = Brickowl</li>
                        </ul>
                      </div>
                    </div>
                  }
                />
              </div>
              <div>
                <select
                  name="colName"
                  id="colName"
                  onChange={(e) => setPrefColorName(e.target.value as ColName)}
                  value={prefColorName}
                >
                  {Object.values(ColName).map((ColName) => (
                    <option key={ColName} value={ColName}>
                      {ColName.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <div>
                Preferred Color ID{" "}
                <MyToolTip
                  id="colIdTip"
                  content={
                    <div style={{ maxWidth: "20em" }}>
                      <div>
                        Which color ID to display when navigating this site. If
                        an ID is not available for the selected preference, no
                        ID will be shown.
                      </div>
                      <div>
                        <ul>
                          <li>TLG = The LEGO Group</li>
                          <li>BL = Bricklink</li>
                          <li>BO = Brickowl</li>
                          <li>QE = theqelement.com QID</li>
                        </ul>
                      </div>
                    </div>
                  }
                />
              </div>
              <div>
                <select
                  name="colId"
                  id="colId"
                  onChange={(e) => setPrefColorId(e.target.value as ColId)}
                  value={prefColorId}
                >
                  {Object.values(ColId).map((colId) => (
                    <option key={colId} value={colId}>
                      {colId.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {showColorUpdater && (
              <GenericPopup
                content={
                  <div className="d-flex flex-col ai-center">
                    <ColorTextField setter={setNewFaveColorId} />
                    <button
                      style={{ marginTop: "1em" }}
                      onClick={() => {
                        if (newFaveColorId != -1) {
                          faveColorMutation.mutate({ id: newFaveColorId });
                        }
                      }}
                    >
                      Save
                    </button>
                  </div>
                }
                closePopup={closePopUp}
              />
            )}
            <div className="w-100 d-flex jc-space-b">
              <div>Favorite LEGO Color</div>
              <div className="d-flex flex-col ai-end">
                <div className="no-margin-children">
                  {me.favoriteColor ? (
                    <ColorLink color={me.favoriteColor} />
                  ) : (
                    <span>none</span>
                  )}
                </div>
                <small
                  className="clickable"
                  
                  onClick={() => setShowColorUpdater(true)}
                >
                  update
                </small>
              </div>
            </div>
            <div className="w-100 d-flex jc-center">
              <button
                onClick={(e) => {
                  let dto: IUserPrefDTO = {
                    lang: lang,
                    allowMessages: allowMessages,
                    isCollectionVisible: collectionVisible,
                    isWantedVisible: wantedVisible,
                    prefName: prefColorName as string,
                    prefId: prefColorId as string,
                  };
                  console.log(dto);

                  if (checkForChanges()) {
                    userPrefMutation.mutate(dto);
                  } else {
                    showToast("No changes to save", Mode.Error);
                  }
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <LoadingPage />;
  }

  function closePopUp() {
    setShowColorUpdater(false);
  }
}
