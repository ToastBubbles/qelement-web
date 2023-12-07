import { useContext, useState } from "react";
import { AppContext } from "../../context/context";
import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { IAPIResponse, IUserDTO, IUserPrefDTO } from "../../interfaces/general";
import LoadingPage from "../../components/LoadingPage";
import showToast, { Mode, formatDate } from "../../utils/utils";
import SliderToggle from "../../components/SliderToggle";
import MyToolTip from "../../components/MyToolTip";
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
      jwt: { payload },
    },
  } = useContext(AppContext);
  const defaultVals: IUserPrefDTO = {
    lang: "unchanged",
    isCollectionVisible: true,
    isWantedVisible: true,
    allowMessages: true,
    prefName: "unchanged",
    prefId: "unchanged",
  };
  const [prefDTO, setPrefDTO] = useState<IUserPrefDTO>(defaultVals);
  const [wantedVisible, setWantedVisible] = useState<boolean>(false);

  const [preferredColorName, setPreferredColorName] = useState<ColName>(
    ColName.BL
  );
  const [preferredColorId, setPreferredColorId] = useState<ColId>(ColId.TLG);
  const { data } = useQuery({
    queryKey: `user${payload.id}`,
    queryFn: () =>
      axios.get<IUserDTO>(`http://localhost:3000/user/id/${payload.id}`),
    // onSuccess() {
    // },
    enabled: !!payload.id,
  });
  const userPrefMutation = useMutation({
    mutationFn: (userPrefs: IUserPrefDTO) =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/userPreference/userId`,
        payload.id
      ),
    onSuccess: () => {
      showToast("UserPref successfully submitted for approval!", Mode.Success);
    },
  });

  if (data) {
    const me = data.data;
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
                <SliderToggle
                  getter={wantedVisible}
                  setter={setWantedVisible}
                />
              </div>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <div>Allow others to see my Wanted Lists</div>
              <div>
                <SliderToggle
                  getter={wantedVisible}
                  setter={setWantedVisible}
                />
              </div>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <div>Allow others to see my Collection</div>
              <div>
                <SliderToggle
                  getter={wantedVisible}
                  setter={setWantedVisible}
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
                        it will fallback to the next best option. i.e. If there
                        is no Bricklink name available, the TLG name will be
                        displayed instead.
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
                  onChange={(e) =>
                    setPreferredColorName(e.target.value as ColName)
                  }
                  value={preferredColorName}
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
                  onChange={(e) => setPreferredColorId(e.target.value as ColId)}
                  value={preferredColorId}
                >
                  {Object.values(ColId).map((colId) => (
                    <option key={colId} value={colId}>
                      {colId.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-100 d-flex jc-center">
              <button>Save Changes</button>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <LoadingPage />;
  }
}
