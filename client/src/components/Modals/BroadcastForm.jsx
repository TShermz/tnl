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
import SingleBroadcastForm from "./SingleBroadcastForm.jsx";
import {
  hardBroadcasts,
  eliteBroadcasts,
  masterBroadcasts,
  broadcastTierFilters,
  casketSources
} from "../../util/constants.js";

import { broadcastFormActions } from "../../store/slices/broadcastFormSlice.js";
import { myLogsActions } from "../../store/slices/myLogsSlice.js";
import {
  addBroadcast,
  getDetailedBroadcast,
  editBroadcast,
  deleteBroadcast
} from "../../util/broadcasts.js";
import { queryClient } from "../../util/http.js";

const testText = "text";

export default function BroadcastForm({ handleClose }) {
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

  async function handleDeleteBroadcast (){
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
    data.dateReceived = data.dateReceived === '' ? null : data.dateReceived;

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

  if (isDeleting) {
    content = (
      <>
        <Modal.Header>
          <Modal.Title>Confirm Broadcast Deletion</Modal.Title>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Modal.Header>

        <Modal.Body>
        <Button id="deleteBroadcastButton" variant="secondary" onClick={handleDeleteBroadcast}>
            Yes, delete.
          </Button>
          <Button id="keepBroadcastButton" variant="secondary" onClick={handleCloseModal}>
            No! I want to keep it.
          </Button>
        </Modal.Body>
      </>
    );
  } else {
    content = (
      <SingleBroadcastForm />
    );
  }

  return (
    <>
      {errorData && (
        <ErrorBlock title={errorData.title} message={errorData.message} />
      )}
      <Modal size="lg" show={showModal} onClose={handleCloseModal}>
        {content}
      </Modal>
    </>
  );
}
