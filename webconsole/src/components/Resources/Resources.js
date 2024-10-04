import React, { useState } from 'react';
import NavBar from '../Utils/NavBar';
import SideBar from '../Utils/SideBar';
import './Resources.css';
import ResourceSection from './ResourceSection';

const Resources = () => {
  const heartResources = [
      {
          title: "Importance of Heart Health",
          description: "Resource 1 Description",
          link: "www.resource1.link.com"
      },
      {
          title: "5 Things to Do for Decreasing Heart Attacks",
          description: "Resource 2 Description",
          link: "www.resource2.link.com"
      }];
  
  const diabetesResources = [
    // Add similar structure for diabetes
  ];

  return (
    <div className="resource-container">
      <NavBar userLoggesIn="true"/>
      <div className="resource-content">
        <SideBar access="true" tab="resources"/>
        <div className="resource-main-content">
         <ResourceSection title="Heart" resources={heartResources} />
         <ResourceSection title="Diabetes" resources={diabetesResources} />
        </div>
      </div>
    </div>
  );
};

export default Resources;
