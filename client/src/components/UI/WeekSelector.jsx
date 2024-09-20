import "./WeekSelector.css";

import { useDispatch, useSelector } from "react-redux";
import { generalActions } from "../../store/slices/generalSlice";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

export default function WeekSelector() {
  const dispatch = useDispatch();
  const selectedWeek = useSelector((state) => state.general.selectedWeek);

  const leftArrowClasses = selectedWeek === 1 ? "hide" : "";
  const rightArrowClasses = selectedWeek === 14 ? "hide" : "";

  function adjustWeek(method) {
    dispatch(generalActions.adjustSelectedWeek(method));
  }

  return (
    <>
      <div className="weekSelector">
        <div className="arrows">
          {
            <KeyboardDoubleArrowLeftIcon
              className={leftArrowClasses}
              onClick={() => adjustWeek("decrement")}
              fontSize="large"
            />
          }
        </div>

        <h2>Week {selectedWeek}</h2>
        <div className="arrows">
          <KeyboardDoubleArrowRightIcon
            className={rightArrowClasses}
            onClick={() => adjustWeek("increment")}
            fontSize="large"
          />
        </div>
      </div>
    </>
  );
}
