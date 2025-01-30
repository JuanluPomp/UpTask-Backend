import type { Request, Response, NextFunction } from "express"
import Project, { ITask } from "../models/Task"
import Task from "../models/Task"


declare global {
    namespace Express{
        interface Request {
            task: ITask
        }
    }
}

export async function validateTaskExist(req: Request, res: Response, next: NextFunction){
        try {
            const {taskId} = req.params
            const task = await Task.findById(taskId)
            if(!task){
                const error = new Error('Tarea no encontrada')
                res.status(404).json({error: error.message})
                return
            }
            req.task = task
            next()
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
}
export async function taskBelogsToProject(req: Request, res: Response, next: NextFunction){
        if(req.task.project.toString() !== req.project.id.toString()){
            const error = new Error('La tarea no pertenece al proyecto')
            res.status(400).json({error: error.message})
            return
        }
        next()
}

