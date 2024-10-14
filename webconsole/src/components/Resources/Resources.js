import React, { useState, useEffect } from 'react';
import NavBar from '../Utils/NavBar';
import SideBar from '../Utils/SideBar';
import './Resources.css';
import ResourceSection from './ResourceSection';

const Resources = () => {
  const resources = [
    {
      category: "Heart",
      items: [
        {
          title: "Importance of Heart Health",
          description: "Resource 1 Description",
          link: "www.resource1.link.com"
        },
        {
          title: "5 Things to Do for Decreasing Heart Attacks",
          description: "Resource 2 Description",
          link: "www.resource2.link.com"
        }
      ]
    },
    {
      category: "Diabetes",
      items: []
    }
  ];
  const [allResources, setAllResources] = useState([]);

  useEffect(() => {
    getAllResources();
  }, []);
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
        console.log(data)
        setAllResources(data);
      }
    } catch (error) {
      console.log(error)
    }
  };
  return (
    <div className="resource-container">
      <NavBar userLoggesIn="true" />
      <div className="resource-content">
        <SideBar access="true" tab="resources" />
        <div className="resource-main-content">
          <ResourceSection resources={resources} />
        </div>
      </div>
    </div>
  );
};

export default Resources;
