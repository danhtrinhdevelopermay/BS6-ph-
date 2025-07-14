import { storage } from './storage';
import { geminiService } from './gemini-service';
import { User } from '@shared/schema';

export class AISystem {
  private aiUser: User | null = null;

  /**
   * Get or create the AI user "ABS Pro"
   */
  async getAIUser(): Promise<User> {
    if (this.aiUser) return this.aiUser;

    // Try to find existing AI user
    const existingAI = await storage.getUserByUsername('abs_pro');
    if (existingAI) {
      this.aiUser = existingAI;
      return existingAI;
    }

    // Create AI user if it doesn't exist
    try {
      this.aiUser = await storage.createUser({
        firebaseUid: 'ai-abs-pro-uid-' + Date.now(),
        username: 'abs_pro',
        email: 'ai@brightstarts.academy',
        displayName: 'ABS Pro',
        photoURL: '/ai-avatar.svg',
        level: 999,
        xp: 999999,
        isAI: true,
        isVerified: true,
      });
      
      console.log('Created AI user ABS Pro:', this.aiUser);
      return this.aiUser;
    } catch (error) {
      console.error('Failed to create AI user:', error);
      throw error;
    }
  }

  /**
   * Process a new post and generate AI response
   */
  async processNewPost(postId: number, content: string): Promise<void> {
    try {
      const aiUser = await this.getAIUser();
      
      // Analyze the post with Gemini
      const analysis = await geminiService.analyzePost(content);
      
      // Only respond if confidence is above threshold
      if (analysis.confidence < 0.6) {
        console.log('AI confidence too low, skipping response');
        return;
      }

      // Create AI comment with delay to seem more natural
      setTimeout(async () => {
        try {
          await storage.createPostComment({
            postId,
            userId: aiUser.id,
            content: analysis.response,
          });
          
          console.log(`AI responded to post ${postId} with type: ${analysis.type}`);
        } catch (error) {
          console.error('Failed to create AI comment:', error);
        }
      }, Math.random() * 3000 + 2000); // 2-5 second delay
      
    } catch (error) {
      console.error('Failed to process post for AI response:', error);
    }
  }

  /**
   * Get AI user profile information
   */
  async getAIProfile(): Promise<User & { stats: any }> {
    const aiUser = await this.getAIUser();
    
    // Get AI's activity stats
    const posts = await storage.getUserPosts(aiUser.id);
    const totalComments = await storage.getPostComments(0); // This would need a proper count query
    
    return {
      ...aiUser,
      stats: {
        totalResponses: totalComments.length,
        postsHelped: posts.length,
        expertise: ['Toán học', 'Khoa học', 'Văn học', 'Ngoại ngữ', 'Lập trình'],
        joinedDate: aiUser.createdAt,
      }
    };
  }
}

export const aiSystem = new AISystem();