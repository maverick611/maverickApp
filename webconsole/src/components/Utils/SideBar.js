        import React, { useState } from 'react';
        import './SideBar.css';
        import { useNavigate } from 'react-router-dom';

        const Sidebar = (props) => {
          const [hasAccess, setHasAccess] = useState(props.access);
          const [tab, setTab] = useState(props.tab);
          const navigate = useNavigate();
          return (
            <div className="sidebar">
              <ul>
                <li className={props.tab == 'profile' ? 'active' : ''}>Profile</li>
                {hasAccess ? (
                  <span>
                    <li className={props.tab == 'users' ? 'active' : ''} onClick={() => navigate('/users')}>Manage Users</li>
                    <li className={props.tab == 'questions' ? 'active' : ''} onClick={() => navigate('/questions')}>Manage Questionnaire</li>
                    <li className={props.tab == 'resources' ? 'active' : ''} onClick={() => navigate('/resources')}>Manage Resource</li>
                    <li className={props.tab == 'daily' ? 'active' : ''} onClick={() => navigate('/daily-questions')}>Manage Daily Questionnaire</li>
                  </span>
                  ) : null}
          </ul>
            </div>
          );
        };

        export default Sidebar;
