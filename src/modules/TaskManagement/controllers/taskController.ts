import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../../middlewares/jwtMiddleware";
import taskService from "../services/taskService";

export const CreateTask = async(req: Request, res: Response): Promise<void> => {
    console.log('task create request is here');
    
    const { ProjectId } = req.params;
    const {
        taskTitle,
        status,
        assignedTo,
        priority,
        startDate,
        dueDate,
        description,
        cat
    } = req.body;

    try {
        const result = await taskService.createTask(
            ProjectId,
            taskTitle,
            description,
            status,
            dueDate,
            assignedTo,
            startDate,
            priority,
            cat
        );
        res.status(200).json(result);
    } catch (error: any) {
        console.error(error);
        if (error.message === 'Project not found') {
            res.status(200).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Error creating project" });
        }
    }
}

export const uploadAttachments = async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;
        console.log('file data is here');
        
        // Check if a file is present
        if (!req.file) {
            return res.status(400).json({ message: "No file provided" });
        }
        
        // File URL returned by Cloudinary
        const fileUrl = req.file.path; // Cloudinary URL
        const fileName = req.file.originalname; // Original file name
        
        const result = await taskService.uploadAttachment(taskId, fileUrl, fileName);
        return res.status(200).json(result);
    } catch (error: any) {
        console.error("Upload error:", error);
        if (error.message === 'Task not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const listUsers = async(req: Request, res: Response): Promise<void> => {
    console.log('user list request is here');
    
    try {
        const { ProjectId } = req.params;
        const result = await taskService.getProjectUsers(ProjectId);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Project not found' || error.message === 'Department not found') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error });
        }
    }
}

export const taskdetails = async(req: Request, res: Response): Promise<void> => {
    try {
        const { taskId } = req.params;
        const result = await taskService.getTaskDetails(taskId);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Task is not found') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error });
        }
    }
}

export const listTasks = async(req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { employeeId } = req.params;
        const tasks = await taskService.getEmployeeTasks(employeeId);
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
}

export const listAttachments = async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;
        const result = await taskService.getTaskAttachments(taskId);
        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error listing attachments:', error);
        if (error.message === 'Task not found') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;
        const result = await taskService.deleteTask(taskId);
        return res.status(200).json(result);
    } catch (error: any) {
        console.error(error);
        if (error.message === 'Task not found or unable to delete the Task') {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: 'An error occurred while deleting the task' });
    }
};