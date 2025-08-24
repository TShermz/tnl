import "./FilterButtons.css";
import { Button, ButtonGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";

import { useDispatch, useSelector } from "react-redux";
import { generalActions } from "../../store/slices/generalSlice";

export default function FilterButtons({ className, buttons, filterType }) {
  const dispatch = useDispatch();
  let currentFilterValue = useSelector(
    (state) => state.general.selectedLeagueName
  );

  const classes = `${className} btn-group`;

  function handleClick(filterValue) {
    dispatch(generalActions.setSelectedLeague(filterValue));
  }

  return (
    <>
      <ButtonGroup aria-label="Basic example" className={classes}>
        {buttons.map((buttonLabel) => {
          return (
            <Button
              key={buttonLabel}
              variant="secondary"
              onClick={() => handleClick(`${buttonLabel}`)}
              className={
                currentFilterValue === `${buttonLabel}` ? "selected" : ""
              }
            >
              {buttonLabel}
            </Button>
          );
        })}
      </ButtonGroup>

      <Form.Select value={currentFilterValue} onChange={(e)=> handleClick(e.target.value)}>
        {buttons.map((buttonLabel) => {
          return (
            <option
              key={buttonLabel}
              onChange={() => handleClick(`${buttonLabel}`)}
            >
              {buttonLabel}
            </option>
          );
        })}
      </Form.Select>
    </>
  );
}
