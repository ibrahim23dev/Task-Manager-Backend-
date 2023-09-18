//const res = require('express/lib/response');
const TaskModel = require('../Model/TaskModel');

exports.CreateTask = async (req, res) => {
    try {
        const reqBody = req.body;
        reqBody.email = req.headers.email;
        const data = await TaskModel.create(reqBody);
        res.status(200).json({ status: 'success', data });
    } catch (error) {
        res.status(400).json({ status: 'fail', data: error });
    }
}

exports.deleteTask = async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: id };
        const data = await TaskModel.deleteOne(query);
        res.status(200).json({ status: 'success', data });


    } catch (error) {
        res.status(400).json({status:'fail',error})
    }
}

exports.UpdateTask = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.params;
        const Quary = { _id: id };
        const reqBody = { status };
        const data = await TaskModel.updateOne(Quary, reqBody);
        res.status(200).json({ status: 'success', data });
    } catch (error) {
         res.status(400).json({status:'fail',error})
    }
}

exports.ListTask = async (req, res) => {
    try {
        const status = req.params.status;
        const email = req.headers.email;
        const data = await TaskModel.aggregate([
            {
                $match: { status, email },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    status: 1,
                    createdDate: {
                        $dateToString: {
                            date: '$createdDate',
                            format: '%d-%m-%Y',
                        },
                    },
                },
            },
        ]);
        res.status(200).json({ status: 'success', data });
    } catch (error) {
        res.status(400).json({status:'fail',error})
    }
}

exports.taskStatusCount = async (req, res) => {
    try {
        const email = req.headers.email;
        const data = await TaskModel.aggregate([
            {
                $match: { email },
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json({ status: 'success', data });
    } catch (err) {
        res.status(400).json({ status: 'fail', data: err });
    }
};