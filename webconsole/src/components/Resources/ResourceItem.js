import React from 'react';

const ResourceItem = ({ title, description, link , minimized}) => {
  return (
    <div className="resource-item">
      {!minimized && <div className="card-body" style={{"display":"flex", "justifyContent": "space-between"}}>
        <div>
            <p>Title : {title}</p>
            <p>Description : {description}</p>
            Resource Link : <a href={link}>{link}</a>
        </div>
        <div className="resource-actions">
            <button>Edit</button>
            <button>Delete</button>
        </div>
        </div>}
    </div>
  );
};

export default ResourceItem;