import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import profileIcon from '../FrontEnd/Pictures/user.png';
import notificationIcon1 from '../FrontEnd/Pictures/notification.png';
import peopleIcon from '../FrontEnd/Pictures/people.png';//PEOPLES ICON
import edit from '../FrontEnd/Pictures/edit.png';
import editblog from '../FrontEnd/Pictures/pencil.png';
import delete1 from '../FrontEnd/Pictures/delete.png';
import logout from '../FrontEnd/Pictures/logout.png';
import createpost from '../FrontEnd/Pictures/create.png';
import sortpost from '../FrontEnd/Pictures/sort.png';
import '../Style/UserProfile.css';

const token = localStorage.getItem('token');

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen1, setIsDialogOpen1] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [dataUpdated, setDataUpdated] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editedBlogTitle, setEditedBlogTitle] = useState('');
  const [editedBlogContent, setEditedBlogContent] = useState('');
  const [editedBlogCategories, setEditedBlogCategories] = useState('');
  const [editedBlogKeywords, setEditedBlogKeywords] = useState('');
  const [openComments, setOpenComments] = useState({});
  const [searchCategory, setSearchCategory] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');  
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [newBlogCategories, setNewBlogCategories] = useState('');
  const [newBlogKeywords, setNewBlogKeywords] = useState('');
  const [isnotiDropdownOpen, setIsnotiDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
//
//  const [searchblogid, setsearchblogid] = useState('');


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
        setEditUsername(response.data.data.username);
        setEditEmail(response.data.data.email);
        fetchUserBlogs(response.data.data._id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchUserBlogs = async (authorId) => {
      try {
        const response = await axios.get(`http://localhost:3000/api/blogs/authors?authorId=${authorId}`, {
   
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

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };
    const toggleComments = (blogId) => {
        setOpenComments(prevOpenComments => ({
            ...prevOpenComments,
            [blogId]: !prevOpenComments[blogId]
        }));
    };
  const handleSaveChanges = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.patch(
        'http://localhost:3000/api/auth/update',
        {
          username: editUsername,
          email: editEmail,
          password: editPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData((prevData) => ({ ...prevData, ...response.data.updatedUser }));
      setIsDialogOpen(false);
      setDataUpdated(true);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleEditBlog = (blogId) => {
    const blogToEdit = userBlogs.find((blog) => blog._id === blogId);
    setEditingBlog(blogToEdit);

    // Set the initial values for editing
    setEditedBlogTitle(blogToEdit.title);
    setEditedBlogContent(blogToEdit.content);
    setEditedBlogCategories(blogToEdit.categories.join(', '));
    setEditedBlogKeywords(blogToEdit.keywords.join(', '));
  };

  const handleCancelEdit = () => {
    setEditingBlog(null);
  };

  const handleUpdateBlog = async () => {
    if (editingBlog) {
      try {
        await axios.patch(
          `http://localhost:3000/api/blogs/${editingBlog._id}`,
          {
            title: editedBlogTitle,
            content: editedBlogContent,
            categories: editedBlogCategories.split(', ').map((category) => category.trim()),
            keywords: editedBlogKeywords.split(', ').map((keyword) => keyword.trim()),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update the local state with the edited values
        setUserBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === editingBlog._id
              ? {
                  ...blog,
                  title: editedBlogTitle,
                  content: editedBlogContent,
                  categories: editedBlogCategories.split(', ').map((category) => category.trim()),
                  keywords: editedBlogKeywords.split(', ').map((keyword) => keyword.trim()),
                }
              : blog
          )
        );

        // Clear the editing state
        setEditingBlog(null);
      } catch (error) {
        console.error('Error updating the blog:', error);
      }
    }
  };

  const handleDelete = async (blogId) => {
    try {
      await axios.delete(`http://localhost:3000/api/blogs/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserBlogs((currentBlogs) => currentBlogs.filter((blog) => blog._id !== blogId));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  //
  const toggleCreatePostForm = () => {
    setIsDialogOpen1(!isDialogOpen1);
  };

  const handleCreateNewPost = async () => {
    try {
      await axios.post(
        'http://localhost:3000/api/blogs/create',
        {
          title: newBlogTitle,
          content: newBlogContent,
          categories: newBlogCategories.split(',').map((c) => c.trim()),
          keywords: newBlogKeywords.split(',').map((k) => k.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the blog list and close the dialog
      setDataUpdated(true);
      setIsDialogOpen1(false);
    } catch (error) {
      console.error('Error creating a new blog:', error);
    }
  };

   const handleSortPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/search/search?sortBy=-createdAt', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserBlogs(response.data.blogs);
    } catch (error) {
      console.error('Error fetching sorted blogs:', error);
    }
  };
  //
  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/search/search', {
        params: {
          category: searchCategory,
          keywords: searchKeyword,
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
  // Use this single toggleDropdown function
  const togglenotiDropdown = () => {
    setIsnotiDropdownOpen(!isnotiDropdownOpen);
  };
//
const fetchNotifications = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/userInteractions/notifications', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setNotifications(response.data.notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

useEffect(() => {
  fetchNotifications();
}, []);

  
  return (
    <div>
      <nav className="navbar">
        <ul>
          <li>
            <a href="#" className="profile-icon">
              <img src={profileIcon} alt="Profile" />
            </a>
          </li>
          <li>
            <Link to="/userhome">HOME</Link>
          </li>
          <li className="notification-icon">
          <Link to="/people" className="notification-icon">
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
      <div className="notification-div">
        {/* Use onClick to toggle the dropdown */}
        <img
          src={notificationIcon1}
          alt="Notification"
          onClick={() => setIsnotiDropdownOpen(!isnotiDropdownOpen)}
        />
      </div>
      {isnotiDropdownOpen && (
        <div className="notification-dropdown">
          {/* Dropdown content goes here */}
          {/* You can map over notifications and display them here */}
          {notifications.map((notification) => (
            <div key={notification._id} className="notification-item">
              {notification.message}
            </div>
          ))}
        </div>
      )}


      {userData && (
        <div className="user-info-container">
          <h2>
            User Information
            <img src={edit} alt="Edit" className="edit-icon" onClick={toggleDialog} />
          </h2>
          <p>Username: {userData.username}</p>
          <p>Email: {userData.email}</p>
          <p>ID: {userData._id}</p>
          <p>ROLE: {userData.role}</p>
        </div>
      )}
      {isDialogOpen && (
        <div className="dialog-box">
          <form onSubmit={handleSaveChanges}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
            />
            <button type="submit">Save Changes</button>
          </form>
          <button onClick={toggleDialog}>Close</button>
        </div>
      )}
       <div className="additional-content">
       <h2>Create Some Things</h2>
       <p>Create new posts to inspire your friends and others!</p>
       <img className="create-post-icon" src={createpost} alt="Create Post Icon" onClick={toggleCreatePostForm} />
       {/*  onClick={toggleCreatePostForm} */}
       </div>
       {isDialogOpen1 && (
        <div className="dialog-box">
          <h3>Create New Blog Post</h3>
          <input type="text" placeholder="Title" value={newBlogTitle} onChange={(e) => setNewBlogTitle(e.target.value)} />
          <textarea placeholder="Content" value={newBlogContent} onChange={(e) => setNewBlogContent(e.target.value)} />
          <input type="text" placeholder="Categories (comma separated)" value={newBlogCategories} onChange={(e) => setNewBlogCategories(e.target.value)} />
          <input type="text" placeholder="Keywords (comma separated)" value={newBlogKeywords} onChange={(e) => setNewBlogKeywords(e.target.value)} />
          <button onClick={handleCreateNewPost}>Post</button>
          <button onClick={toggleCreatePostForm}>Discard</button>
        </div>
      )}
       <div className="sort-div">
       <img className="sort-post-icon" src={sortpost} alt="Sort Post Icon"onClick={handleSortPosts} // Add this line
       />
       </div>
       <div className="search-div">
    <input
      type="text"
      placeholder="Search by category"
      value={searchCategory}
      onChange={(e) => setSearchCategory(e.target.value)}
    />
    <input
      type="text"
      placeholder="Search by keyword"
      value={searchKeyword}
      onChange={(e) => setSearchKeyword(e.target.value)}
    />
    <button onClick={handleSearch}>Search</button>
     </div>      
      <div className="blog-list">
        {userBlogs.map((blog) => (
          <div key={blog._id} className="blog-card">
            <img
              src={delete1}
              alt="Delete"
              className="delete-icon"
              onClick={() => handleDelete(blog._id)}
            />
            <div className="blog-header">
              <span className="blog-author">{blog.author.username}</span>
              {editingBlog === blog ? (
                <>
                  <button onClick={handleUpdateBlog}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                <img
                  src={editblog}
                  alt="Edit Blog"
                  className="edit-blog-icon"
                  onClick={() => handleEditBlog(blog._id)}
                  style={{ marginLeft: '10px' }}
                />
              )}
              <span className="blog-date">{blog.createdAt}</span>
            </div>
            {editingBlog === blog ? (
              <>
                <input
                  type="text"
                  value={editedBlogTitle}
                  onChange={(e) => setEditedBlogTitle(e.target.value)}
                />
                <textarea
                  value={editedBlogContent}
                  onChange={(e) => setEditedBlogContent(e.target.value)}
                />
                <input
                  type="text"
                  value={editedBlogCategories}
                  onChange={(e) => setEditedBlogCategories(e.target.value)}
                />
                <input
                  type="text"
                  value={editedBlogKeywords}
                  onChange={(e) => setEditedBlogKeywords(e.target.value)}
                />
              </>
            ) : (
              <>
                <div className="blog-title">{blog.title}</div>
                <div className="blog-footer">
                  <span className="blog-content">{blog.content}</span>
                  <span className="blog-category">{blog.categories.join(', ')}</span>
                  <span className="blog-keywords">{blog.keywords.join(', ')}</span>
                  <div className="blog-rating">
                    {(blog.ratings.reduce((acc, cur) => acc + cur, 0) / blog.ratings.length).toFixed(
                      2
                    )}
                  </div>
                  <button className="comments-button" onClick={() => toggleComments(blog._id)}>
                            {openComments[blog._id] ? 'Hide Comments' : 'Show Comments'}
                  </button>
                  {openComments[blog._id] && (
                            <div className="blog-comments">
                                {blog.comments.map(comment => (
                                    <div key={comment._id}>{comment.text} by {blog.author.username}</div>
                                ))}
                            </div>
                        )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );


};

export default UserProfile;
