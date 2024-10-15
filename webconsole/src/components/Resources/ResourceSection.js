import React, { useState } from 'react';
import ResourceItem from './ResourceItem';
import { Typography, Button, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./Resources.css"

const ResourceSection = ({ title, resources }) => {

    const [minimized, setMinimized] = useState(false);
    return (
        <div className="resource-section">
            <h2>Resources</h2>
            {resources.map((resource, index) => (
                <Accordion key={index} className="card">
                    <AccordionSummary
                        expandIcon={<Button variant="contained" color="success" size="small">
                            <ExpandMoreIcon />
                        </Button>}
                        aria-controls={`panel${index}-content`}
                        id={`panel${index}-header`}
                        sx={{ backgroundColor: '#d3e6c6' }}
                    >
                        <Typography variant="h5" sx={{ color: '#388e3c' }}><strong>{resource.category}</strong></Typography>
                        <Box ml="auto">
                            <Button variant="contained" color="success" size="small" sx={{ marginRight: 1 }}>
                                <AddIcon />
                            </Button>

                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        {resource.items.map((item, index) => <ResourceItem key={index} item={item} />)}
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
};

export default ResourceSection;