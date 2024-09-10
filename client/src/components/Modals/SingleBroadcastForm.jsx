import "./Modals.css";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { useQuery, useMutation } from "@tanstack/react-query";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Modal from "react-bootstrap/Modal";
import Tooltip from "react-bootstrap/Tooltip";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FilterTierButtons from "../UI/FilterTierButtons.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import BroadcastImagePicker from "../UI/BroadcastImagePicker.jsx";
import {
  hardBroadcasts,
  eliteBroadcasts,
  masterBroadcasts,
  broadcastTierFilters,
  casketSources,
} from "../../util/constants.js";

import { broadcastFormActions } from "../../store/slices/broadcastFormSlice.js";
import { myLogsActions } from "../../store/slices/myLogsSlice.js";
import {
  addBroadcast,
  getDetailedBroadcast,
  editBroadcast,
  deleteBroadcast,
} from "../../util/broadcasts.js";
import { queryClient } from "../../util/http.js";

const testText = "text";

export default function SingleBroadcastForm({ handleClose }) {
  const dispatch = useDispatch();

  const selectedLog = useSelector(
    (state) => state.broadcastForm.currentBroadcastFormFilter
  );
  const selectedBroadcast = useSelector(
    (state) => state.broadcastForm.selectedBroadcast
  );

  const editBroadcastId = useSelector(
    (state) => state.broadcastForm.editBroadcastId
  );

  const deleteBroadcastId = useSelector(
    (state) => state.broadcastForm.deleteBroadcastId
  );

  const isEditing = useSelector((state) => state.broadcastForm.isEditing);
  const isDeleting = useSelector((state) => state.broadcastForm.isDeleting);
  const showModal = useSelector((state) => state.broadcastForm.showModal);

  let content;

  const {
    data: editData,
    isPending: editIsPending,
    isError: editIsError,
    error: editError,
    status: editStatus,
  } = useQuery({
    queryKey: ["myBroadcasts", editBroadcastId],
    queryFn: async () => {
      let detailedBroadcast = await getDetailedBroadcast({
        id: editBroadcastId,
      });
      return detailedBroadcast;
    },
  });

  //introduce useEffect to track when the selectedBroadcast and filterValue change when new items are edits
  useEffect(() => {
    if (editStatus === "success") {
      dispatch(
        broadcastFormActions.filterBroadcastForm({
          filterValue: editData?.clueTier,
        })
      );
      dispatch(
        broadcastFormActions.selectBroadcast({
          broadcast: editData?.broadcastName,
        })
      );
    }
  }, [editStatus, editData]);

  const { mutate: addMutate } = useMutation({
    mutationFn: addBroadcast,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myBroadcasts"],
        refetchType: "all",
      });
      dispatch(myLogsActions.filterLog({ filterValue: selectedLog }));
      handleClose();
    },
  });

  const { mutate: editMutate } = useMutation({
    mutationFn: editBroadcast,
    onSuccess: () => {
      handleClose();
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["myBroadcasts"],
      });
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteBroadcast,
    onSuccess: () => {
      handleClose();
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["myBroadcasts"],
      });
    },
  });

  const handleCloseModal = () => {
    dispatch(broadcastFormActions.toggleModal());
    dispatch(broadcastFormActions.reset());
  };

  let currentBroadcasts, errorData;

  if (selectedLog === "hard") {
    currentBroadcasts = hardBroadcasts;
  } else if (selectedLog === "elite") {
    currentBroadcasts = eliteBroadcasts;
  } else {
    currentBroadcasts = masterBroadcasts;
  }

  async function handleDeleteBroadcast() {
    deleteMutate(deleteBroadcastId);
    dispatch(broadcastFormActions.reset());
    dispatch(broadcastFormActions.toggleModal());
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (selectedBroadcast === undefined) {
      console.log("error");
      return (errorData = {
        title: "Form Incomplete",
        message: "Please select a broadcast before submitting.",
      });
    }

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.dateReceived = data.dateReceived === "" ? null : data.dateReceived;

    const allData = {
      ...data,
      clueTier: selectedLog,
      broadcastName: selectedBroadcast,
      broadcastId: isEditing ? editData.broadcastId : null,
    };
    isEditing ? editMutate(allData) : addMutate(allData);

    dispatch(broadcastFormActions.toggleModal());

    // errorData = await onSubmit(data, mode);
  }

  return (content = (
    <>
      <Modal.Header>
        <Modal.Title>
          {isEditing ? "Edit Broadcast" : "Add Broadcast"}
        </Modal.Title>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
      </Modal.Header>

      <Modal.Body>
        <FilterTierButtons
          className="tier-filter"
          buttons={broadcastTierFilters}
          filterType="broadcastForm"
        />
        <Form id="broadcastForm" onSubmit={handleSubmit} className="form">
          <h5 style={{ fontWeight: "bold" }}>Required Information:</h5>

          <div className="requiredInputs">
            <Form.Group className="" controlId="method">
              <Form.Label className="mb-2">Method of Obtaining:</Form.Label>
              <Form.Select
                id="source"
                name="source"
                className=""
                defaultValue={editData?.source}
              >
                {casketSources.map((source) => {
                  return <option key={source}>{source}</option>;
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="" controlId="broadcastCount">
              <Form.Label className="mb-2 broadcastCountLabel">
                Broadcast Count:{" "}
                <OverlayTrigger
                  key={testText}
                  placement="top"
                  overlay={
                    <Tooltip id="tooltip-top">
                      Enter "6" if this was your 6th Orlando Smiths Hat
                    </Tooltip>
                  }
                >
                  <ErrorOutlineOutlinedIcon fontSize="small" />
                </OverlayTrigger>
              </Form.Label>
              <Form.Control
                type="number"
                name="broadcastCount"
                defaultValue={editData?.broadcastCount}
                min={1}
                max={250}
                required
              />
            </Form.Group>
          </div>

          <Form.Label className="mt-2 mb-0">Select a broadcast:</Form.Label>
          <BroadcastImagePicker
            broadcasts={currentBroadcasts}
            hasBroadcasts={true}
            isForm={true}
            defaultValue={editData?.broadcastName}
          />

          <h5 style={{ fontWeight: "bold" }}>Optional Information:</h5>

          <div className="optionalInputs">
            <Form.Group className="mb-13" controlId="clueCount">
              <Form.Label>Clue Count:</Form.Label>
              <Form.Control
                type="number"
                name="clueCount"
                defaultValue={editData?.clueCount}
                min={1}
                max={300000}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="sellPrice">
              <Form.Label>Sell Price:</Form.Label>
              <Form.Control
                type="number"
                name="sellPrice"
                defaultValue={editData?.sellPrice}
                min={0}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="dateReceived">
              <Form.Label>Date Received:</Form.Label>
              <Form.Control
                type="text"
                name="dateReceived"
                defaultValue={editData?.dateReceived ?? null}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="submitButton">
              Save Broadcast
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </>
  ));
}
