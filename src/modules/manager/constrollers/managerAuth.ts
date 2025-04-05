import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../employee/models/userModel";
import { generateAccessToken } from "../../../middlewares/jwt";
import projectModel from "../../admin/models/projectModel";
import Leave from "../../leaveManagement/models/leaveModel";
import { Meeting } from "../../meetings/model/MeetingModal";
import taskModel from "../../TaskManagement/models/taskModel";


interface managerLoginBody{
    email:string;
    password:string;
}

export const managerLogin = async(req:Request<{},{},managerLoginBody>,res:Response):Promise<void>=>{
try {
    const {email ,password} = req.body;
const user = await User.findOne({email:email});


if(!user){
    res.status(400).json({message:'User not found Please'});
    return;
}

const passMatch = await bcrypt.compare(password,user.password);

if(!passMatch){
    res.status(400).json({message:'Wrong Password'});
    return
}

if(user.employeeStatus === 'inactive'){
    res.status(400).json({ message: "Account inactive" });
    return;
  }

if(user.position != 'Manager'){
res.status(400).json({message:'Manager Not Found in this credentials'});
return
}

const accessToken = generateAccessToken(user._id);  // Corrected here
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET!, 
      { expiresIn: '7d' }
    );

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensure the cookie is sent over HTTPS in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });


res.status(200).json({accessToken,manager:user})
} catch (error) {
    console.log(error);
    res.status(500).json({error:'An error occured during login'})
    
    
}



}


export const ManagerDashboard = async(req:Request,res:Response):Promise<void>=>{
    try {

        const { managerId } = req.params;
    console.log('request is here as manager');

    const managerDetails = await User.findById(managerId);
    if (!managerDetails) {
      res.status(404).json({ message: 'Manager not found' });
      return;
    }

    const managerDepId = managerDetails.department;
    const users = await User.find({ department: managerDepId, position: 'Employee' });
    
    if (!users || users.length === 0) {
      res.status(400).json({ message: 'No Users Found' });
      return;
    }

    const userIds = users.map(user => user._id); // Collect all user IDs
    const leaves = await Leave.find({ userId: { $in: userIds } }).populate('userId') // Find leaves for all users


    const upcomingMeetings = await Meeting.find({
        
        createdBy:managerId,

        
        status: 'scheduled'
      });


      const projects = await projectModel.find({department:managerDepId})




    res.status(200).json({leaves,upcomingMeetings,projects,})
        
    } catch (error) {
        console.log(error);
    res.status(500).json({error:'An error occured during login'})
    }
}