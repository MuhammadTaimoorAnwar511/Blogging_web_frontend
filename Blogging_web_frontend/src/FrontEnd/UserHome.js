
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import profileIcon from '../FrontEnd/Pictures/user.png';
import peopleIcon from '../FrontEnd/Pictures/people.png';//PEOPLES ICON
import logout from '../FrontEnd/Pictures/logout.png';
import '../Style/UserHome.css';

const token = localStorage.getItem('token');

const UserProfile = () => {

  const [userData, setUserData] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null); 
  const [openComments, setOpenComments] = useState({});
  const [searchCategory, setSearchCategory] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');  
  const [searchAuthor, setSearchAuthor] = useState('');
  const [comment, setComment] = useState(''); 
  const [showCommentBox, setShowCommentBox] = useState({});
  const [ratings, setRatings] = useState({}); // Object to store ratings keyed by blog ID

  const [followedUsers, setFollowedUsers] = useState({});


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

    const fetchUserBlogs = async (authorId) => {
      try {
        // const response = await axios.get(`http://localhost:3000/api/blogs/authors?authorId=${authorId}`, {

        const response = await axios.get(`http://localhost:3000/api/userInteractions/blogs`, {
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

    const toggleComments = (blogId) => {
        setOpenComments(prevOpenComments => ({
            ...prevOpenComments,
            [blogId]: !prevOpenComments[blogId]
        }));
    };
  
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
  

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const postComment = async (blogId) => {
    try {
      await axios.post(`http://localhost:3000/api/blogs/${blogId}/comment`, 
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment(''); // Reset comment input
      setDataUpdated(true); // Trigger data update to fetch comments
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const toggleCommentBox = (blogId) => {
    setShowCommentBox(prev => ({ ...prev, [blogId]: !prev[blogId] }));
  };

  const handleRatingChange = (blogId, newRating) => {
    setRatings(prevRatings => ({ ...prevRatings, [blogId]: newRating }));
  };

  const submitRating = async (blogId) => {
    try {
      const ratingValue = ratings[blogId];
      await axios.post(`http://localhost:3000/api/blogs/${blogId}/rate`, 
        { rating: ratingValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Optionally reset rating input and refresh data
      setRatings(prevRatings => ({ ...prevRatings, [blogId]: undefined }));
      setDataUpdated(true); // Trigger re-fetch of blog data if needed
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };
//
const handleFollowUser = async (userIdToFollow) => {
  try {
    await axios.patch(`http://localhost:3000/api/userInteractions/follow/${userIdToFollow}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Update the followedUsers state
    setFollowedUsers(prev => ({ ...prev, [userIdToFollow]: true }));
  } catch (error) {
    console.error('Error following the user:', error);
  }
};



 return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/userprofile" className="profile-icon">
              <img src={profileIcon} alt="Profile" />
            </Link>
          </li>
          <li>
            <a href="#">HOME</a>
          </li>
          <li>
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

      {/* Search Bar */}
      <div className="search-div1">
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
        <input
          type="text"
          placeholder="Search by author"
          value={searchAuthor}
          onChange={(e) => setSearchAuthor(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Blog List */}
      <div className="blog-list">
        {userBlogs.map((blog) => (
          <div key={blog._id} className="blog-card1">
            {/* Blog Header */}
            <button className="follow-button" onClick={() => !followedUsers[blog.author._id] && handleFollowUser(blog.author._id)}>
            {followedUsers[blog.author._id] ? 'Following' : 'Follow'}
            </button>

            <div className="blog-header">
              <span className="blog-author">{blog.author.username}</span>
              <span className="blog-date">{blog.createdAt}</span>
            </div>

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
                  <button className="comments-button" onClick={() => toggleComments(blog._id)}>
                            {openComments[blog._id] ? 'Hide Comments' : 'Show Comments'}
                  </button>

                  {openComments[blog._id] && (
                            <div className="blog-comments">
                                {blog.comments.map(comment => (
                                    <div key={comment._id}>{comment.text} by {blog.author.username}</div>
                                ))}

                {/* Comment Input Section */}
                {showCommentBox[blog._id] && (
                  <div>
                    <textarea value={comment} onChange={handleCommentChange} />
                    <button className="cancel-button" onClick={() => postComment(blog._id)}>Reply</button>
                    <button className="cancel-button" onClick={() => toggleCommentBox(blog._id)}>Cancel</button>
                  </div>
                )}
                
                {/* Button to show/hide comment input box */}
                <button className="comments-button" onClick={() => toggleCommentBox(blog._id)}>
                  {showCommentBox[blog._id] ? 'Hide Comment Box' : 'Comment'}
                </button>
                            </div>
                    )}
        {/* rating */}
        <div className="blog-rating-section">
        <input type="number" min="1" max="10" value={ratings[blog._id] || ''} onChange={(e) => handleRatingChange(blog._id, e.target.value)} />
        <button className="rate-button" onClick={() => submitRating(blog._id)}>Rate</button>
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

export default UserProfile;

