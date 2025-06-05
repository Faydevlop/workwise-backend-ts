import { Request, Response } from "express";
import recruitmentService from "../services/recruitmentService";

export const createRecruitment = async (req: Request, res: Response): Promise<void> => {
    console.log('Received data:', req.body);

    try {
        const result = await recruitmentService.createRecruitment(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        console.error('Error creating job post:', error);
        if (error.message === 'All fields are required.') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

export const listrquirements = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await recruitmentService.listRecruitments();
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'No Job Listing found') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

export const deleteItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { listId } = req.params;
        const result = await recruitmentService.deleteRecruitment(listId);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Unable to delete') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

export const referJob = async (req: Request, res: Response): Promise<void> => {
    try {
        const resumeUrl = (req.file as any)?.path; // Cloudinary file URL
        console.log('Resume URL:', resumeUrl);
        
        const referralData = {
            ...req.body,
            resumeUrl
        };
        
        const result = await recruitmentService.referJob(referralData);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error referring job', error });
    }
};

export const listIReq = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await recruitmentService.listReferrals();
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'No Job Listing found') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error listing job', error });
        }
    }
};

export const listspecific = async (req: Request, res: Response): Promise<void> => {
    try {
        const { reqId } = req.params;
        const result = await recruitmentService.getReferralDetails(reqId);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'No data found') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error listing job', error });
        }
    }
};

export const deleteJobapplications = async (req: Request, res: Response): Promise<void> => {
    try {
        const { applicationId } = req.params;
        console.log('delete req is here');
        
        const result = await recruitmentService.deleteJobApplication(applicationId);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'No application found') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

export const getUserData = async (req: Request, res: Response): Promise<void> => {
    try {
        const { jobId } = req.params;
        const result = await recruitmentService.getJobDetails(jobId);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Listing data not found') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

export const updataJonlist = async (req: Request, res: Response): Promise<void> => {
    try {
        const { jobId } = req.params;
        const result = await recruitmentService.updateJobListing(jobId, req.body);
        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error updating job:', error);
        if (error.message === 'Job ID is required') {
            res.status(400).json({ message: error.message });
        } else if (error.message === 'Job not found') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};