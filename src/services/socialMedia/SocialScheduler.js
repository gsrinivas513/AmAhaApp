// src/services/socialMedia/SocialScheduler.js
import { db } from '../../firebase/firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

class SocialScheduler {
  /**
   * Schedule a post for a specific date and time
   */
  async schedulePost(postId, scheduledDate, timezone = 'UTC') {
    try {
      // Convert to UTC
      const scheduledDateTime = this.convertToUTC(scheduledDate, timezone);

      const postRef = doc(db, 'social_posts', postId);
      await updateDoc(postRef, {
        status: 'scheduled',
        scheduledFor: Timestamp.fromDate(new Date(scheduledDateTime)),
        timezone,
        updatedAt: serverTimestamp(),
      });

      return {
        success: true,
        message: `Post scheduled for ${scheduledDateTime}`,
      };
    } catch (error) {
      console.error('Error scheduling post:', error);
      throw error;
    }
  }

  /**
   * Schedule multiple posts for a daily posting plan
   */
  async scheduleDaily(posts, startDate, timezone = 'UTC', timeOfDay = '09:00') {
    try {
      const scheduled = [];
      let currentDate = new Date(startDate);

      for (const post of posts) {
        const [hours, minutes] = timeOfDay.split(':').map(Number);
        currentDate.setHours(hours, minutes, 0, 0);

        await this.schedulePost(post.id, currentDate, timezone);
        scheduled.push({
          postId: post.id,
          scheduledFor: new Date(currentDate),
        });

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return scheduled;
    } catch (error) {
      console.error('Error scheduling daily posts:', error);
      throw error;
    }
  }

  /**
   * Schedule posts for specific days of the week
   */
  async scheduleWeekly(
    postsByDay,
    timezone = 'UTC',
    startDate = new Date()
  ) {
    try {
      const dayMapping = {
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
        sunday: 0,
      };

      const scheduled = [];
      let currentDate = new Date(startDate);

      for (const [day, posts] of Object.entries(postsByDay)) {
        const targetDay = dayMapping[day.toLowerCase()];
        if (targetDay === undefined) continue;

        // Find next occurrence of this day
        while (currentDate.getDay() !== targetDay) {
          currentDate.setDate(currentDate.getDate() + 1);
        }

        for (const post of posts) {
          await this.schedulePost(post.id, currentDate, timezone);
          scheduled.push({
            postId: post.id,
            day,
            scheduledFor: new Date(currentDate),
          });
        }

        // Move to next week
        currentDate.setDate(currentDate.getDate() + 7);
      }

      return scheduled;
    } catch (error) {
      console.error('Error scheduling weekly posts:', error);
      throw error;
    }
  }

  /**
   * Get posts ready to be published
   */
  async getPostsReadyToPublish() {
    try {
      const now = new Date();
      const q = query(
        collection(db, 'social_posts'),
        where('status', '==', 'scheduled'),
        where('scheduledFor', '<=', Timestamp.fromDate(now))
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
    } catch (error) {
      console.error('Error fetching posts ready to publish:', error);
      return [];
    }
  }

  /**
   * Get scheduled posts for a date range
   */
  async getScheduledPostsInRange(startDate, endDate) {
    try {
      const q = query(
        collection(db, 'social_posts'),
        where('status', 'in', ['scheduled', 'published']),
        where('scheduledFor', '>=', Timestamp.fromDate(startDate)),
        where('scheduledFor', '<=', Timestamp.fromDate(endDate))
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
    } catch (error) {
      console.error('Error fetching scheduled posts:', error);
      return [];
    }
  }

  /**
   * Convert date/time to UTC
   */
  convertToUTC(date, timezone) {
    // Simple conversion - in production, use a library like date-fns-tz
    const d = new Date(date);
    
    // Get timezone offset
    const timezoneOffsets = {
      'UTC': 0,
      'EST': -5,
      'CST': -6,
      'MST': -7,
      'PST': -8,
      'IST': 5.5,
      'GMT': 0,
    };

    const offset = timezoneOffsets[timezone.toUpperCase()] || 0;
    const utcDate = new Date(d.getTime() + offset * 60 * 60 * 1000);
    return utcDate;
  }

  /**
   * Convert UTC to specific timezone
   */
  convertFromUTC(utcDate, timezone) {
    const timezoneOffsets = {
      'UTC': 0,
      'EST': -5,
      'CST': -6,
      'MST': -7,
      'PST': -8,
      'IST': 5.5,
      'GMT': 0,
    };

    const offset = timezoneOffsets[timezone.toUpperCase()] || 0;
    const localDate = new Date(
      utcDate.getTime() - offset * 60 * 60 * 1000
    );
    return localDate;
  }

  /**
   * Generate recommended posting schedule
   */
  generateRecommendedSchedule(contentPieces = []) {
    return {
      weeklySchedule: {
        monday: {
          time: '09:00',
          contentType: 'quiz',
          description: 'Kids Quiz',
        },
        tuesday: {
          time: '10:00',
          contentType: 'puzzle',
          description: 'Puzzle Challenge',
        },
        wednesday: {
          time: '14:00',
          contentType: 'quiz',
          description: 'Programming Quiz',
        },
        thursday: {
          time: '09:00',
          contentType: 'quiz',
          description: 'Kids Quiz',
        },
        friday: {
          time: '16:00',
          contentType: 'puzzle',
          description: 'Weekend Puzzle',
        },
        saturday: {
          time: '10:00',
          contentType: 'quiz',
          description: 'Parent Tips',
        },
        sunday: {
          time: '18:00',
          contentType: 'quiz',
          description: 'Best of the Week',
        },
      },
      platforms: ['instagram', 'facebook', 'twitter', 'linkedin'],
      timezone: 'UTC',
      notes: 'Adjust times based on your audience\'s peak activity',
    };
  }
}

export default new SocialScheduler();
