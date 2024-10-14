import { Box, Button, Link, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

const ResourceItem = ({ key, item }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    title: item.title,
    description: item.description,
    link: item.link
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditValues({
      title: item.title,
      description: item.description,
      link: item.link
    });
  };

  const handleConfirmClick = () => {
    // Here you would typically update the data source with editValues
    console.log('Updated values:', editValues);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };
  return (
    // <Box key={key} sx={{ marginBottom: 2, padding: 1, borderBottom: '1px solid #ccc', display: "flex", justifyContent: 'space-between' }}>
    //   <div className='resource-item'>
    //     <Typography variant="body1"><strong>Title : </strong> {item.title}</Typography>
    //     <Typography variant="body2"><strong>Description : </strong> {item.description}</Typography>
    //     <Typography variant="body2">
    //       <strong>Resource Link : </strong>
    //       <Link href={`http://${item.link}`} target="_blank" rel="noopener noreferrer">
    //         {item.link}
    //       </Link>
    //     </Typography>
    //   </div>

    //   <Box mt={1}>
    //     <Button variant="contained" color="primary" size="small" sx={{ marginRight: 1 }}>Edit</Button>
    //     <Button variant="contained" color="secondary" size="small">Delete</Button>
    //   </Box>
    // </Box>
    <Box key={key} sx={{ marginBottom: 2, padding: 1, borderBottom: '1px solid #ccc', display: "flex", justifyContent: 'space-between' }}>
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
              sx={{ '& .MuiInputBase-input': { padding: '4px' } }}
            />
            <TextField
              label="Description"
              name="description"
              value={editValues.description}
              onChange={handleChange}
              fullWidth
              margin="dense"
              sx={{ '& .MuiInputBase-input': { padding: '4px' } }}
            />
            <TextField
              label="Resource Link"
              name="link"
              value={editValues.link}
              onChange={handleChange}
              fullWidth
              margin="dense"
              sx={{ '& .MuiInputBase-input': { padding: '4px' } }}
            />
          </>
        ) : (
          <>
            <Typography variant="body1"><strong>Title:</strong> {item.title}</Typography>
            <Typography variant="body2"><strong>Description:</strong> {item.description}</Typography>
            <Typography variant="body2">
              <strong>Resource Link:</strong>
              <Link href={`http://${item.link}`} target="_blank" rel="noopener noreferrer">
                {item.link}
              </Link>
            </Typography>
          </>
        )}
      </div>

      <Box mt={1}>
        {isEditing ? (
          <>
            <Button variant="contained" color="success" size="small" sx={{ marginRight: 1 }} onClick={handleConfirmClick}>
              Confirm
            </Button>
            <Button variant="contained" color="default" size="small" onClick={handleCancelClick}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button variant="contained" color="primary" size="small" sx={{ marginRight: 1 }} onClick={handleEditClick}>
              Edit
            </Button>
            <Button variant="contained" color="secondary" size="small">
              Delete
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ResourceItem;