import { Box, Button, Link, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import DialogComponent from '../Utils/Dialog';

const ResourceItem = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    title: props.item.title,
    description: props.item.description,
    link: props.item.link
  });
  const [dialogDelete, setDialogDelete] = useState({ open: false, message: '' });

  const toggleDialog = () => {
    setDialogDelete({ open: !dialogDelete.open, message: "" });
  }
  const handleDeleteClick = (item) => {
    setDialogDelete({ open: true, message: `Are you sure you want to delete ${item.title}`, data: item });
  }
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditValues({
      title: props.item.title,
      description: props.item.description,
      link: props.item.link
    });
  };

  const handleConfirmClick = () => {
    console.log('Updated values:', editValues);
    setIsEditing(false);
    props.handleEditResource({ ...editValues, resource_id: props.item.resource_id });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };
  return (
    <Box key={props.key} sx={{ marginBottom: 2, padding: 1, borderBottom: '1px solid #ccc', display: "flex", justifyContent: 'space-between' }}>
      <div className='resource-item'>
        {isEditing ? (
          <>
            <TextField
              label="Title"
              name="title"
              value={editValues.title}
              onChange={handleChange}
              fullWidth
              margin="dense"
              sx={{ '& .MuiInputBase-input': { padding: '8px' } }}
            />
            <TextField
              label="Description"
              name="description"
              value={editValues.description}
              onChange={handleChange}
              fullWidth
              margin="dense"
              sx={{ '& .MuiInputBase-input': { padding: '8px' } }}
            />
            <TextField
              label="Resource Link"
              name="link"
              value={editValues.link}
              onChange={handleChange}
              fullWidth
              margin="dense"
              sx={{ '& .MuiInputBase-input': { padding: '8px' } }}
            />
          </>
        ) : (
          <>
            <Typography variant="body1"><strong>Title : </strong> {props.item.title}</Typography>
            <Typography variant="body2"><strong>Description : </strong> {props.item.description}</Typography>
            <Typography variant="body2">
              <strong>Resource Link : </strong>
              <Link href={`http://${props.item.link}`} target="_blank" rel="noopener noreferrer">
                {props.item.link}
              </Link>
            </Typography>
          </>
        )}
      </div>

      <Box mt={1}>
        {isEditing ? (
          <>
            <Button variant="contained" color="default" size="small" sx={{ marginRight: 1 }} onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button variant="contained" color="success" size="small" onClick={handleConfirmClick}>
              Confirm
            </Button>
          </>
        ) : (
          <>
            <Button variant="contained" color="primary" size="small" sx={{ marginRight: 1, fontSize: "x-large" }} onClick={handleEditClick}>
              <MdOutlineEdit />
            </Button>
            <Button variant="contained" color="secondary" size="small" sx={{ marginRight: 1, fontSize: "x-large" }} onClick={() => handleDeleteClick(props.item)}>
              <MdDeleteOutline />
            </Button>
          </>
        )}
      </Box>
      {dialogDelete.open && <DialogComponent openDialog={dialogDelete.open} alertMessage={dialogDelete.message} data={dialogDelete.data} no={"No"} yes={"Yes"} action={props.handleDeleteResource} cancel={toggleDialog} />}
    </Box >
  );
};

export default ResourceItem;