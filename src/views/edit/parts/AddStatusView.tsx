import axios from "axios";
import { useContext, useState } from "react";
import { useQuery, useMutation } from "react-query";
import {
  IAPIResponse,
  IPartStatusDTO,
  IQPartDTOIncludeLess,
} from "../../../interfaces/general";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import MyToolTip from "../../../components/MyToolTip";
import { useParams } from "react-router";
import showToast, { Mode } from "../../../utils/utils";
import { AppContext } from "../../../context/context";

export default function AddStatusView() {
  const {
    state: {
      jwt: { token, payload },
    },
  } = useContext(AppContext);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const { qpartId } = useParams();

  const defaultStatusValues: IPartStatusDTO = {
    id: 0,
    status: "unknown",
    date: new Date().toLocaleDateString(),
    location: "",
    note: "",
    creatorId: -1,
    qpartId: -1,
  };

  const [newStatus, setNewStatus] =
    useState<IPartStatusDTO>(defaultStatusValues);

  const { data: qpartData, isFetched: qpartIsFetched } = useQuery({
    queryKey: `qpart${qpartId}`,
    queryFn: () => {
      return axios.get<IQPartDTOIncludeLess>(
        `http://localhost:3000/qpart/getDetails/${qpartId}`
      );
    },

    staleTime: 0,
    enabled: !!qpartId,
  });
  const partStatusMutation = useMutation({
    mutationFn: (status: IPartStatusDTO) =>
      axios.post<IAPIResponse>(`http://localhost:3000/partStatus/add`, status, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (e) => {
      if (e.data.code == 201) {
        showToast("Status submitted for approval!", Mode.Success);
        setNewStatus((prevVals) => ({
          ...defaultStatusValues,
          creatorId: prevVals.creatorId,
        }));
        setStartDate(new Date());
      } else if (e.data.code == 200) {
        showToast("Status succesfully added!", Mode.Success);
        setNewStatus((prevVals) => ({
          ...defaultStatusValues,
          creatorId: prevVals.creatorId,
        }));
        setStartDate(new Date());
      } else {
        showToast("Error adding status!", Mode.Error);
      }
    },
  });

  if (qpartData?.data && qpartIsFetched) {
    const qpart = qpartData.data;
    return (
      <>
        <div className="formcontainer">
          <h1>add new status</h1>
          <div className="mainform">
            <div className="w-100 d-flex jc-space-b">
              <div>Part:</div>
              <div>
                <div className="formInput">
                  {qpart.mold.parentPart.name} ({qpart.mold.number})
                </div>
              </div>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <div>Color:</div>
              <div>
                {qpartData && (
                  <div className="formInput">
                    {qpart.color.bl_name
                      ? qpart.color.bl_name
                      : qpart.color.tlg_name}
                  </div>
                )}
              </div>
            </div>

            <div className="w-100 d-flex jc-space-b">
              <div>
                <label htmlFor="seid">Status</label>
                <MyToolTip
                  content={
                    <ul className="tt-list">
                      <li>
                        <span>unknown:</span> this element may exist, but not
                        much is known
                      </li>
                      <li>
                        <span>element ID only:</span> we have an element ID for
                        this part, but it has yet to be seen/found
                      </li>
                      <li>
                        <span>seen:</span> this element has been seen, but no
                        one has collected one
                      </li>
                      <li>
                        <span>found:</span> you or another collecter has
                        collected this element
                      </li>
                      <li>
                        <span>known:</span> This element has been released in a
                        set or Pick a Brick
                      </li>
                      <li>
                        <span>other:</span> doesn't fit the other categories,
                        please leave a note if using this option
                      </li>
                    </ul>
                  }
                  id="status"
                />
              </div>
              <select
                className="formInput w-50"
                onChange={(e) =>
                  setNewStatus((newStatus) => ({
                    ...newStatus,
                    ...{ status: e.target.value },
                  }))
                }
                value={newStatus.status}
              >
                <option value={"unknown"}>Unknown</option>
                <option value={"idOnly"}>Element ID Only</option>
                <option value={"seen"}>Seen</option>
                <option value={"found"}>Found</option>
                <option value={"known"}>Known</option>
                <option value={"other"}>Other</option>
              </select>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <div>
                <label htmlFor="location">Location</label>
                <MyToolTip
                  content={
                    <ul className="tt-list">
                      Location that this element is known to exist, examples:
                      <li>LEGOLAND Discovery Center, New York, USA</li>
                      <li>LEGOLAND, Florida, USA, Pick-a-Brick Wall</li>
                      <li>Germany</li>
                      <li>Europe</li>
                      If found in more than one loaction, list addition in the
                      Note
                    </ul>
                  }
                  id="location"
                />
              </div>
              <input
                maxLength={100}
                id="location"
                className="formInput w-50"
                placeholder="Optional"
                onChange={(e) =>
                  setNewStatus((newStatus) => ({
                    ...newStatus,
                    ...{ location: e.target.value },
                  }))
                }
                value={newStatus.location}
              />
            </div>
            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="date">Date</label>
              <div className="w-50">
                <DatePicker
                  className="w-100 formInput"
                  selected={startDate}
                  onChange={(date) => {
                    if (date != null) setStartDate(date);
                  }}
                />
              </div>
            </div>
            <label htmlFor="satusnote" style={{ marginRight: "auto" }}>
              Note for Status
            </label>
            <div className="w-100 d-flex">
              <textarea
                maxLength={255}
                id="satusnote"
                className="fg-1 formInput"
                rows={5}
                placeholder="Optional"
                onChange={(e) =>
                  setNewStatus((newStatus) => ({
                    ...newStatus,
                    ...{ note: e.target.value },
                  }))
                }
                value={newStatus.note}
              />
            </div>
            <div>
              <button
                className="formInputNM"
                onClick={() => {
                  if (qpartId && Number(qpartId) != -1 && payload) {
                    console.log("adding...");
                    partStatusMutation.mutate({
                      id: 0,
                      status: newStatus.status,
                      location: newStatus.location,
                      note: newStatus.note,
                      creatorId: payload.id,
                      date: startDate.toDateString(),
                      qpartId: Number(qpartId),
                    });
                    setNewStatus(defaultStatusValues);
                  } else {
                    console.log(newStatus);

                    showToast(
                      "Please make sure you have filled out the form properly",
                      Mode.Error
                    );
                  }
                }}
              >
                Add Status
              </button>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <p>Loading...</p>;
  }
}
