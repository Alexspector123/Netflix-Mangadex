import React, { useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import ChapterSidebar from '../components/ChapterSidebar';

const ChapLayout = () => {
  const [sidebar, setSidebar] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const contentRef = useRef(null);

  const showSidebar = () => setSidebar(!sidebar);
  const toggleHeader = () => setShowHeader((prev) => !prev);

  return (
      <div>
          {sidebar && (
            <div
              className='fixed right-0 top-0 
                          h-screen
                          bg-white
                          z-50'>
              <ChapterSidebar closeSidebar={() => setSidebar(false)} toggleHeader={toggleHeader}/>
            </div>)}
        <div
        ref={contentRef}>
          <Outlet context={{ showSidebar, showHeader, toggleHeader }} />
        </div>
      </div>
  );
};

export default ChapLayout;
