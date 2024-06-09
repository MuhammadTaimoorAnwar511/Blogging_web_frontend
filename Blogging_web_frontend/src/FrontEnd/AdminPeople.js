import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import profileIcon from '../FrontEnd/Pictures/user.png';
import peopleIcon from '../FrontEnd/Pictures/people.png';//PEOPLES ICON
import logout from '../FrontEnd/Pictures/logout.png';
import '../Style/UserHome.css';

const token = localStorage.getItem('token');

const AdminHome = () => {

  const [userData, setUserData] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null); 
  const [searchCategory, setSearchCategory] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');  
  const [searchAuthor, setSearchAuthor] = useState('');
  const [blockedUsers, setBlockedUsers] = useState({}); 
  const [blockedpost, setBlockedpost] = useState({}); 
//
const [inputValue, setInputValue] = useState('');
  useEffect(() => {
    const fetchUserData = async () => {
      setDataUpdated(false);
      try {
        const response = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data.data);
        fetchUserBlogs(response.data.data._id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchUserBlogs = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/admin/blogs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserBlogs(response.data.blogs);
      } catch (error) {
        console.error('Error fetching user blogs:', error);
      }
    };
    fetchUserData();
  }, [dataUpdated]);
  
  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/search/search', {
        params: {
          category: searchCategory,
          keywords: searchKeyword,
          author: searchAuthor,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserBlogs(response.data.blogs);

    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };
  //
  const toggleUserBlockStatus = async (userId) => {
    try {
      const isBlocked = blockedUsers[userId];
      const method = isBlocked ? 'delete' : 'patch'; // Use 'delete' or 'patch', as per your API
      const endpoint = isBlocked ? `unblock/${userId}` : `block/${userId}`;
  
      await axios[method](`http://localhost:3000/api/admin/${endpoint}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Update the blockedUsers state
      setBlockedUsers(prevState => ({
        ...prevState,
        [userId]: !prevState[userId]
      }));
  
      // Show an alert message
      alert(`User has been ${isBlocked ? 'unblocked' : 'blocked'}.`);
    } catch (error) {
      console.error('Error toggling user block status:', error);
    }
  };

  const togglePostBlockStatus = async (blogId) => {
    try {
      const isBlocked = blockedpost[blogId];
      const method = 'patch'; // Since we are toggling the status
      // Corrected endpoint construction
      const endpoint = isBlocked ? `enable-blog/${blogId}` : `disable-blog/${blogId}`;
      
      await axios[method](`http://localhost:3000/api/admin/${endpoint}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Update the blockedpost state
      setBlockedpost(prevState => ({
        ...prevState,
        [blogId]: !prevState[blogId]
      }));
  
      // Show an alert message
      alert(`Post has been ${isBlocked ? 'enabled' : 'disabled'}.`);
    } catch (error) {
      console.error('Error toggling post block status:', error);
    }
  };

  // const handleButtonClickblog = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:3000/api/admin/blog/${inputValue}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     // Handle the response data as needed
  //     const fetchedBlogDetails = response.data.blog;

  //     // Update the state with the fetched blog details
  //     setBlogDetails(fetchedBlogDetails);

  //     // Optionally, you can also clear the input value after a successful search
  //     setInputValue('');
  //   } catch (error) {
  //     console.error('Error fetching blog details:', error);
  //   }
  // };
  
 return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <ul>
          {/* <li>
            <Link to="/userprofile" className="profile-icon">
              <img src={profileIcon} alt="Profile" />
            </Link>
          </li> */}
                  <li>
            <Link to="/adminhome">HOME</Link>
          </li>

          <li>
            <Link to="" className="notification-icon">
            <img src={peopleIcon} alt="Notifications" />
            </Link>
          </li>
          <li>
            <Link to="/login" className="logout-icon">
              <img src={logout} alt="logout" />
            </Link>
          </li>
        </ul>
      </nav>

      {/* Search Bar */}
      <div className="search-div1">
       
      </div>
      {/*
   
      {/* Blog List */}
      <div className="blog-list">
        {userBlogs.map((blog) => (
          <div key={blog._id} className="blog-card1">
        
            {/* Blog Content */}
            {editingBlog === blog ? (
              <>
                {/* Code for editing blog (if needed) */}
              </>
            ) : (
              <>
                <div className="blog-title">{blog.title}</div>
                {/* Blog Footer */}
                <div className="blog-footer">
                  <span className="blog-content">{blog.content}</span>
                  <span className="blog-category">{blog.categories.join(', ')}</span>
                  <span className="blog-keywords">{blog.keywords.join(', ')}</span>
                  <div className="blog-rating">
                    {(blog.ratings.reduce((acc, cur) => acc + cur, 0) / blog.ratings.length).toFixed(2)}
                  </div>
                </div>
              </>
            )}
          </div>
          
        ))}
      </div>
    </div>
  );
};

export default AdminHome;