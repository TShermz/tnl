import { useState } from 'react';
import { useDispatch } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { broadcastFormActions } from '../../store/slices/broadcastFormSlice';

const ITEM_HEIGHT = 48;

export default function LongMenu({id}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  function handleShowModal(id, formType) {
    dispatch(broadcastFormActions.filterBroadcastForm({ filterValue: "hard" }));
    dispatch(broadcastFormActions.toggleModal({ id, formType }));
    handleCloseDropdown();
  }

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseDropdown}
        // PaperProps={{
        //   style: {
        //     maxHeight: ITEM_HEIGHT * 4.5,
        //     width: '20ch',
        //   },
        // }}
      >
          <MenuItem  onClick={() => handleShowModal(id, "edit")}>
            Edit
          </MenuItem>
          <MenuItem  onClick={() => handleShowModal(id, "delete")}>
            Delete
          </MenuItem>
      </Menu>
    </div>
  );
}
