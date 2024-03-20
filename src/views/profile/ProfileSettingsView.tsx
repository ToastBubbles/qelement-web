import { useContext, useState } from "react";
import { AppContext } from "../../context/context";
import axios from "axios";
import { useMutation, useQuery } from "react-query";
import {
  IAPIResponse,
  INodeWithID,
  ITitleDTO,
  IUserDTO,
  IUserPrefDTO,
  iIdOnly,
} from "../../interfaces/general";
import LoadingPage from "../../components/LoadingPage";
import showToast, {
  Mode,
  formatDate,
  getProfilePicture,
} from "../../utils/utils";

import MyToolTip from "../../components/MyToolTip";
import SliderToggle2 from "../../components/SliderToggle2";
import { Types } from "../../context/userPrefs/reducer";
import { UserPrefPayload } from "../../context/userPrefs/context";
import ColorLink from "../../components/ColorLink";
import GenericPopup from "../../components/GenericPopup";
import ColorTextField from "../../components/ColorTextField";
import CustomSelect from "../../components/CustomSelect";
import ProfilePictureUploader from "../../components/ProfilePictureUploader";
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
  const [diffMats, setDiffMats] = useState<boolean>(false);
  const [showProfilePicPopup, setShowProfilePicPopup] =
    useState<boolean>(false);
  const [showColorUpdater, setShowColorUpdater] = useState<boolean>(false);
  const [newFaveColorId, setNewFaveColorId] = useState<number>(-1);
  const [selectedTitleId, setSelectedTitleId] = useState<number | null>(null);
  const [prefColorName, setPrefColorName] = useState<ColName>(ColName.BL);
  const [prefColorId, setPrefColorId] = useState<ColId>(ColId.TLG);
  const { data, refetch: refetchUser } = useQuery({
    queryKey: `user${payload.id}`,
    queryFn: () =>
      axios.get<IUserDTO>(`http://localhost:3000/user/id/${payload.id}`),
    onSuccess(res) {
      const prefs = res.data.preferences;
      setAllowMessages(prefs.allowMessages);
      setCollectionVisible(prefs.isCollectionVisible);
      setWantedVisible(prefs.isWantedVisible);
      setDiffMats(prefs.differentiateMaterialsInCollection);
      setLang(prefs.lang);
      setPrefColorName(prefs.prefName as ColName);
      setPrefColorId(prefs.prefId as ColId);
      setSelectedTitleId(res.data.selectedTitleId);
    },
    enabled: !!payload.id,
  });
  const userPrefMutation = useMutation({
    mutationFn: (userPrefs: IUserPrefDTO) =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/userPreference/userId`,
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
              differentiateMaterialsInCollection: diffMats,
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
        closeColorPopUp();
        console.log(e.data.message);
      }
    },
  });

  const userSetTitleMutation = useMutation({
    mutationFn: (titleId: iIdOnly) =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/user/changeTitle`,
        titleId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast("Title Updated!", Mode.Success);
        console.log(e.data.message);
      }
    },
  });

  if (data) {
    const me = data.data;
    console.log(me);

    function checkForChanges(): boolean {
      let hasChanges = false;
      if (me.preferences.allowMessages != allowMessages) {
        hasChanges = true;
      }
      if (me.preferences.isWantedVisible != wantedVisible) {
        hasChanges = true;
      }
      if (me.preferences.differentiateMaterialsInCollection != diffMats) {
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
        {showProfilePicPopup && (
          <GenericPopup
            content={
              <div>
                <h3>Upload Profile Picture</h3>
                <ProfilePictureUploader
                  userId={me.id}
                  refetchFn={refetchUser}
                  pfpId={me.profilePicture?.id}
                />
              </div>
            }
            closePopup={closePFPPopUp}
          />
        )}
        <div className="formcontainer">
          <h1>Settings</h1>
          <div className="mainform jc-space-b" style={{ height: "38em" }}>
            <div
              className={"clickable pfp-big-container"}
              onClick={() => setShowProfilePicPopup(true)}
            >
              <img
                className="profile-img-big"
                src={getProfilePicture(me.profilePicture, true)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="pfp-camera"
                viewBox="0 0 16 18"
              >
                <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0" />
              </svg>
              <div
                className={
                  me.profilePicture && me.profilePicture.approvalDate == null
                    ? " yellow-border"
                    : ""
                }
              ></div>
            </div>
            {me.profilePicture && me.profilePicture.approvalDate == null && (
              <div className="pfp-warning">
                Your profile picture is pending approval, until it is approved,
                only you can see it!
              </div>
            )}
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
                Differentiate materials in my Collection{" "}
                <MyToolTip
                  id="diffMatsTip"
                  content={
                    <div style={{ maxWidth: "20em" }}>
                      Allows you to specify the material your QParts are. So you
                      can say you have a QPart in PC or in MABS, or both. This
                      feature is disabled by default due to how niche it is.
                    </div>
                  }
                />
              </div>
              <div>
                <SliderToggle2 getter={diffMats} setter={setDiffMats} />
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
            <div className="w-100 d-flex jc-space-b">
              <div>Title</div>
              <div>
                <CustomSelect
                  setter={setSelectedTitleId}
                  options={getOptions(me.titles)}
                  selectedId={me.selectedTitleId}
                  customStyles={{ width: "10em" }}
                />
              </div>
            </div>
            {showColorUpdater && (
              <GenericPopup
                content={
                  <div className="d-flex flex-col ai-center">
                    <div style={{ marginBottom: "2em" }}>
                      Please select your favorite LEGO color
                    </div>
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
                closePopup={closeColorPopUp}
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
                    differentiateMaterialsInCollection: diffMats,
                    prefName: prefColorName as string,
                    prefId: prefColorId as string,
                  };
                  console.log(dto);

                  if (checkForChanges()) {
                    userPrefMutation.mutate(dto);
                  } else if (
                    selectedTitleId &&
                    selectedTitleId != me.selectedTitleId &&
                    selectedTitleId > 0
                  ) {
                    userSetTitleMutation.mutate({ id: selectedTitleId });
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

  function closeColorPopUp() {
    setShowColorUpdater(false);
  }

  function closePFPPopUp() {
    setShowProfilePicPopup(false);
    refetchUser();
  }

  function setDefaultValue(usersTitles: ITitleDTO[]): number {
    console.log("setting value");

    if (selectedTitleId == null) return -1;
    let selectedTitle = usersTitles.find((x) => x.id == selectedTitleId);
    console.log(selectedTitle);

    if (selectedTitle) return selectedTitle.id;
    return -1;
  }

  function getCSS(usersTitles: ITitleDTO[]): string {
    // let thisTitle = usersTitles.find(x=>x.id == value)

    if (selectedTitleId == null || selectedTitleId < 0) return "";
    let selectedTitle = usersTitles.find((x) => x.id == selectedTitleId);
    if (selectedTitle) return selectedTitle.cssClasses;
    return "";
  }

  function getOptions(usersTitles: ITitleDTO[]): INodeWithID[] {
    if (usersTitles.length == 0) return [];

    let output: INodeWithID[] = [];

    usersTitles.forEach((title) =>
      output.push({
        node: <span className={title.cssClasses}>{title.title}</span>,
        id: title.id,
      })
    );
    return output;
  }
}
