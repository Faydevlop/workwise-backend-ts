import { Request, Response } from "express";
import commentService from "../services/commentService";

export const createComment = async(req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;
  const { commentedBy, comment } = req.body;

  try {
    const result = await commentService.createComment(commentedBy, comment, taskId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export const listComments = async(req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;
  
  try {
    const result = await commentService.listComments(taskId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export const updatestatus = async(req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedTask = await commentService.updateTaskStatus(id, status);
    res.status(200).json(updatedTask);
  } catch (error: any) {
    console.error('Error updating task status:', error);
    
    if (error.message === 'Invalid status') {
      res.status(400).json({ message: error.message });
    } else if (error.message === 'Task not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
}