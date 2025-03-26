
import { generateSampleTopics, generateSampleUsers, generateSampleComments } from './use-forum-data';

// Function to initialize local storage with sample data
export const initializeForumData = () => {
  // Initialize topics if not already
  if (!localStorage.getItem('topics') || JSON.parse(localStorage.getItem('topics') || '[]').length === 0) {
    const sampleTopics = generateSampleTopics();
    localStorage.setItem('topics', JSON.stringify(sampleTopics));
    
    // Generate comments for the sample topics
    const sampleComments = generateSampleComments(sampleTopics);
    localStorage.setItem('comments', JSON.stringify(sampleComments));
  }
  
  // Initialize users if not already
  if (!localStorage.getItem('users') || JSON.parse(localStorage.getItem('users') || '[]').length === 0) {
    const sampleUsers = generateSampleUsers();
    localStorage.setItem('users', JSON.stringify(sampleUsers));
  }
  
  // Initialize notifications
  if (!localStorage.getItem('notifications')) {
    localStorage.setItem('notifications', JSON.stringify([]));
  }
  
  // Initialize favorites
  if (!localStorage.getItem('favorites')) {
    localStorage.setItem('favorites', JSON.stringify({}));
  }
};
