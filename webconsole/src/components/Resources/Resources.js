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
  const transformData = (data) => {
    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.disease]) {
        acc[item.disease] = [];
      }

      acc[item.disease].push({
        title: item.resources_title,
        description: item.resources_desc,
        link: item.resource_link
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
  return (
    <div className="resource-container">
      <NavBar userLoggesIn="true" />
      <div className="resource-content">
        <SideBar access="true" tab="resources" />
        <div className="resource-main-content">
          <ResourceSection resources={allResources} />
        </div>
      </div>
    </div>
  );
};

export default Resources;
