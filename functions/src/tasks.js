import dbConnect from "./dbConnect.js";

export async function getTasks(req, res){
    const db = dbConnect();
     const collection = await db.collection('tasks').get()
     .catch(err => res.status(500).send(err));
     const tasks = collection.docs.map(doc => {
        // return {...doc.data(), id: doc.id};
        let task = doc.data();
        task.id = doc.id;
        return task;
     })
    res.send(tasks);
}

export async function createTask(req,res) { // will add user id and a time stamp...
    const newTask = req.body;
    if (!newTask || !newTask.task) {
        res.status(400).send({ success: false, message: 'Invalid request'});
        return;
    } 
    const db = dbConnect();
    await db.collection('tasks').add(newTask)
       .catch(err => res.status(500).send(err));
    res.status(201);
    getTasks(req, res); // send back full list of task
}

export async function updateTask(req, res) {
    const taskUpdate = req.body;
    const { taskId } = req.params;
    const db = dbConnect();
    await db.collection('tasks').doc(taskId).update(taskUpdate)
    .catch(err => res.status(500).send(err));
    res.status(202);
    getTasks(req, res);
}

export function deleteTask(req, res){
    const { taskId } = req.params;
    res.status(203).send('Task Deleted');
}