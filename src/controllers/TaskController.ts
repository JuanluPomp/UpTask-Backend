import type { Request,  Response} from "express";
import Project from "../models/Project";
import Task from "../models/Task";
import { populate } from "dotenv";
import { Error } from "mongoose";
import { param } from "express-validator";


export class TaskController {
    static createTask  = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.tasks.push(task.id)
            
            await Promise.allSettled([task.save(), req.project.save()])
            res.send('Tarea creada correctamente')

        } catch (error) {
            console.log(error)
        }
    }

    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({project: req.project.id}).populate('project')
            res.json(tasks)
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {
            res.json(req.task)
        } catch (error) {
            console.log(error)
        }
    }

    static editTask = async (req: Request, res: Response) => {
        try {
            req.task.taskName = req.body.taskName
            req.task.description = req.body.description
            await req.task.save()
            res.json('La tarea ha sido editada con exito')
        } catch (error) {
            console.log(error)
        }
    }

    static deletetask = async (req: Request, res: Response) => {
        try {
            
            req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id.toString())
            await Promise.allSettled([req.task.deleteOne(),req.project.save()])

            res.json('Tarea eliminada')
        } catch (error) {
            console.log(error)
        }
    }

    static editTaskStatus = async (req: Request, res: Response) => {
        try {
            const {status} = req.body
            req.task.status = status

            await req.task.save()
            res.send('Tarea actualizada')
        } catch (error) {
            console.log(error)
        }
    }
}