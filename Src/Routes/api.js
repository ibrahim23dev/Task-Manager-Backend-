const express =require('express');
const UsersController=require("../Controller/UserController");
const TasksController=require("../Controller/TaskController");
const AuthVerifyMiddleware=require("../Middleware/AuthVerifyMiddleWare");


const router =express.Router();


router.post("/registration",UsersController.Registation);
router.post("/login",UsersController.Login);
router.post("/profileUpdate",AuthVerifyMiddleware,UsersController.ProfileUpdate);
router.get("/profileDetails",AuthVerifyMiddleware,UsersController.ProfileDetails);

router.get("/RecoverVerifyEmail/:email",UsersController.RecoveryVerifyEmail);
router.get("/RecoverVerifyOTP/:email/:otp",UsersController.RecoverOTP);
router.post("/RecoverResetPass",UsersController.RecoverResetPass);


router.post("/createTask",AuthVerifyMiddleware,TasksController.CreateTask);
router.get("/updateTaskStatus/:id/:status",AuthVerifyMiddleware,TasksController.UpdateTask);
router.get("/listTaskByStatus/:status",AuthVerifyMiddleware,TasksController.ListTask);
router.get("/taskStatusCount",AuthVerifyMiddleware,TasksController.taskStatusCount);
router.get("/deleteTask/:id",AuthVerifyMiddleware,TasksController.deleteTask);

module.exports=router;
