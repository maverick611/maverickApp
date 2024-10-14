import React, { useState } from 'react';
import ResourceItem from './ResourceItem';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { Paper, Typography, Button, Link, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ResourceSection = ({ title, resources }) => {

    const [minimized, setMinimized] = useState(false);
    return (
        <div className="resource-section">
            {resources.map((resource, index) => (
                <Accordion key={index} defaultExpanded>
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