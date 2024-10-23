import React, { useEffect, useState } from 'react';
import ResourceItem from './ResourceItem';
import { Typography, Button, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./Resources.css"
import DialogComponent from '../Utils/Dialog';

const ResourceSection = (props) => {
    const [allResources, setAllResources] = useState([]);
    const [popupVisible, setPopupVisible] = useState(false);
    const [newResource, setNewResource] = useState({})

    useEffect(() => {
        getAllResources();
    }, []);

    const togglePopup = () => {
        setPopupVisible(true);
    }
    const handleCancel = () => {
        setPopupVisible(false);
    }

    const transformData = (data) => {
        const groupedData = data.reduce((acc, item) => {
            if (!acc[item.disease]) {
                acc[item.disease] = [];
            }

            acc[item.disease].push({
                title: item.resources_title,
                description: item.resources_desc,
                link: item.resource_link,
                resource_id: item.resource_id
            });

            return acc;
        }, {});

        return Object.entries(groupedData).map(([category, items]) => ({
            category,
            items
        }));
    };

    const getAllResources = async () => {
        try {
            const response = await fetch('http://localhost:3030/fetchResources', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const resources = transformData(data);
                console.log(resources)
                setAllResources(resources);
            }
        } catch (error) {
            console.log(error)
        }
    };
    const handleAddResource = async (resourceItem) => {
        console.log(resourceItem, 'parent')
        try {
            const response = await fetch('http://localhost:3030/addResource', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newResource),
            });

            if (response.ok) {
                const resourceItem = await response.json();
                console.log(resourceItem);
                await getAllResources();
                // setAllResources([...allResources, resourceItem]); // Add the new user to the state
                alert("Resource added successfully");
            } else {
                alert("Failed to add resource");
            }
        } catch (error) {
            console.error("Error adding resource:", error);
            alert("Error adding resource");
        }
    };
    const handleEditResource = async (resourceEditItem) => {
        console.log(resourceEditItem, 'parent')
        try {
            const response = await fetch('http://localhost:3030/editResource', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resourceEditItem),
            });

            if (response.ok) {
                const resourceItem = await response.json();
                console.log(resourceItem);
                await getAllResources();
                // setAllResources([...allResources, resourceItem]); // Add the new user to the state
                alert("Resource updated successfully");
            } else {
                alert("Failed to update resource");
            }
        } catch (error) {
            console.error("Error updating resource:", error);
            alert("Error updating resource");
        }
    };

    const handleDeleteResource = async (deleteResource) => {
        console.log(deleteResource)
        try {
            const response = await fetch(`http://localhost:3030/deleteResource/${deleteResource.resource_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert("Resource deleted successfully");
                const responsedata = await response.json();
                console.log(responsedata);
                await getAllResources();
            } else {
                alert("Failed to delete resource");
            }
        } catch (error) {
            console.error("Error delete resource:", error);
            alert("Error delete resource");
        }
    };

    return (
        <div className="resource-section">
            <h2>Resources</h2>
            {allResources.map((resource, index) => (
                <Accordion key={index} className="card">
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: "#388e3c" }} />}
                        aria-controls={`panel${index}-content`}
                        id={`panel${index}-header`}
                        sx={{ backgroundColor: '#d3e6c6' }}
                    >
                        <Typography variant="h5" sx={{ color: '#388e3c' }}><strong>{resource.category}</strong></Typography>
                        <Box ml="auto">
                            <AddIcon sx={{ marginRight: 1, color: "#388e3c" }} onClick={togglePopup} />
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        {resource.items.map((item, index) =>
                            <ResourceItem key={index} item={item} handleEditResource={handleEditResource} handleDeleteResource={handleDeleteResource} />)}
                    </AccordionDetails>
                </Accordion>
            ))}
            {popupVisible && (
                <DialogComponent openDialog={popupVisible} alertMessage={`Add a new Resource`} data={popupVisible} no={"Cancel"} yes={"Add"} action={handleAddResource} cancel={handleCancel}>
                    <div className="popup-content">
                        <form className='profile-form'>
                            <div style={{ textAlign: "left" }}>
                                <label htmlFor="resourceName">Resource Name</label>
                                <input className="form-control" type="text" id="resourceName" name="resourceName" onChange={(e) => setNewResource({ ...newResource, resource_title: e.target.value })} />
                            </div>
                            <div style={{ textAlign: "left" }}>
                                <label htmlFor="lastName">Disease Name</label>
                                <input type="text" id="diseaseName" name="diseaseName" onChange={(e) => setNewResource({ ...newResource, disease_name: e.target.value })} />
                            </div>
                            <div style={{ textAlign: "left" }}>
                                <label htmlFor="username">Description</label>
                                <input type="textarea" id="descrition" name="description" onChange={(e) => setNewResource({ ...newResource, resource_desc: e.target.value })} />
                            </div>
                            <div style={{ textAlign: "left" }}>
                                <label htmlFor="phone">Resource Link</label>
                                <input type="tel" id="link" name="link" onChange={(e) => setNewResource({ ...newResource, resource_link: e.target.value })} />
                            </div>
                        </form>
                    </div>
                </DialogComponent >
            )}
        </div >
    );
};

export default ResourceSection;