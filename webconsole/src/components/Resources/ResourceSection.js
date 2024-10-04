import React, { useState } from 'react';
import ResourceItem from './ResourceItem';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const ResourceSection = ({ title, resources }) => {

  const [minimized, setMinimized] = useState(false);
  return (
    <div className="resource-section">
      <div className={`card ${minimized ? 'minimized' : ''}`}>
            <div className="card-header">
                <h2>{title}</h2>
                <div>
                    <button >
                        <span className='m-1'>{' + '}</span>
                    </button>
                    <button onClick={() => setMinimized(!minimized)}>
                        {minimized ? <IoIosArrowDown/> : <IoIosArrowUp />}
                    </button>
                </div>
            </div>
            {resources.map((resource, index) => (
                <ResourceItem
                key={index}
                title={resource.title}
                description={resource.description}
                link={resource.link}
                minimized={minimized}
                />
            ))}
        </div>
    </div>
  );
};

export default ResourceSection;