import React, { useState, useEffect } from 'react';
import NavBar from '../Utils/NavBar';
import SideBar from '../Utils/SideBar';
import './Resources.css';
import ResourceSection from './ResourceSection';

const Resources = () => {
  return (
    <div className="resource-content">
      <SideBar access="true" tab="resources" />
      <div className="resource-main-content">
        <ResourceSection />
      </div>
    </div>
  );
};

export default Resources;
