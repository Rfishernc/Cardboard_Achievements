import React from 'react';
import './blogPost.scss';

class blogPost extends React.Component {
  render() {
    return(
      <div className='blogPost'>
        <p className='blogPostTitle'>{this.props.blogTitle}</p>
        <p className='blogPostContent'>{this.props.blogContent}</p>
        <p className='blogPostMisc'>{this.props.datePosted.replace('T00:00:00', '')} by {this.props.author}</p>
      </div>
    );
  }
}

export default blogPost;