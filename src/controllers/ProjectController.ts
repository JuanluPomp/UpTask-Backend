import type { Request, Response } from "express"
import Project from "../models/Project"

export class ProjectController {
    
    static createProject= async (req: Request, res: Response) => {
        const project = new Project(req.body)
        try {
            await project.save()
            res.send('Proyecto creado con exito')
        } catch (error) {
            console.log(error)
        }
        
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({})
            res.json(projects)
        } catch (error) {
            console.log(error)
        }
    }
    
    static getProjectById = async (req: Request, res: Response) => {
        const {id} = req.params
        try {
            const project = await Project.findById(req.params.id).populate('tasks');
            if(!project){
                const error = new Error('Proyecto no encontrado')
                res.status(404).json({error: error.message})
                return
            }
            res.json(project)
        } catch (error) {
            console.log(error)
        }
    } 

    static editProject = async (req: Request, res: Response) => {
        const {id} = req.params
        try {
            const project = await Project.findByIdAndUpdate(id, req.body)
           
            await project.save()
            res.send('Proyecto actualizado')
        } catch (error) {
            console.log(error)
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        const {id} = req.params
        try {
            const project = await Project.findById(id)
            await project.deleteOne()
            res.json('Proyecto Eliminado')
        } catch (error) {
            console.log(error)
        }
    }
}