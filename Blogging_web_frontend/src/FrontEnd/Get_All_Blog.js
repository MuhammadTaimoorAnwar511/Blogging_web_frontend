import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/Get_All_Blog.css'; 

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/admin/blogs', {
                    headers: {
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGJmOTRmOWUwMDRmNzlhOGVkMjBmNSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMDg0MjM4NCwiZXhwIjoxNzAwOTI4Nzg0fQ.mwbHHaFgDbXXU63QvyaR7zb-8QLkxbjRUZBUNzA_7ZM' // Replace with your token
                    }
                });
                setBlogs(response.data.blogs);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchBlogs();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
         <h2>ALL BLOGS</h2>
            {blogs.map(blog => (
                <div key={blog._id}>
                    <h3>{blog.title}</h3>
                    <p>{blog.content}</p>
                    <p>Author: {blog.author.username}</p>
                    <p>Category: {blog.categories.join(', ')}</p>
                    <p>Keywords: {blog.keywords.join(', ')}</p>
                    <p>Rating: {blog.ratings.reduce((acc, cur) => acc + cur, 0) / blog.ratings.length}</p>
                    <h4>Comments:</h4>
                    <ul>
                        {blog.comments.map(comment => (
                            <li key={comment._id}>{comment.text} by {blog.author.username}</li>
                        ))}
                    </ul>
                    {/* Add more blog details here as needed */}
                </div>
            ))}
      </div>
      
    );
};
export default BlogList;