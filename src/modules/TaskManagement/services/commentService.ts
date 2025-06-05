import Comments from "../models/commentsModel";
import taskModel from "../models/taskModel";

export class CommentService {
  async createComment(commentedBy: string, comment: string, taskId: string) {
    if (!commentedBy || !comment) {
      throw new Error("Please fill all the forms");
    }
    
    const newComment = new Comments({
      commentedBy,
      comment,
      taskId
    });
    
    await newComment.save();
    return { message: 'Comment Added Successful' };
  }

  async listComments(taskId: string) {
    const comments = await Comments.find({ taskId })
      .populate('commentedBy');
      
    if (!comments || comments.length === 0) {
      throw new Error('No Comments');
    }
    
    return { comments };
  }

  async updateTaskStatus(taskId: string, status: string) {
    // Validate input
    if (!status || !['Pending', 'InProgress', 'Completed'].includes(status)) {
      throw new Error('Invalid status');
    }

    // Update the task status
    const updatedTask = await taskModel.findByIdAndUpdate(
      taskId,
      { status },
      { new: true } // Return the updated task
    );

    if (!updatedTask) {
      throw new Error('Task not found');
    }
    
    return updatedTask;
  }
}

export default new CommentService();