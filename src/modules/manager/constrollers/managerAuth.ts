import { Request, Response } from "express";
import { authenticateManager, getManagerDashboardData } from "../services/managerService";

interface ManagerLoginBody {
  email: string;
  password: string;
}

export const managerLogin = async (req: Request<{}, {}, ManagerLoginBody>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authenticateManager(email, password);

    if (!result.success) {
      res.status(400).json({ message: result.message });
      return;
    }

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});


    res.status(200).json({ accessToken: result.accessToken, manager: result.manager });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
};

export const managerDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { managerId } = req.params;
    console.log('request is here as manager');

    const result = await getManagerDashboardData(managerId);

    if (!result.success) {
      res.status(400).json({ message: result.message });
      return;
    }

    res.status(200).json(result.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while fetching dashboard data' });
  }
};