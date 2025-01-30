import { Router } from "express"
import { body, param} from "express-validator"
import { ProjectController } from "../controllers/ProjectController"
import { handleInputErrors } from "../middleware/validation"
import { TaskController } from "../controllers/TaskController"
import { validateProjectExist } from "../middleware/project"
import { taskBelogsToProject, validateTaskExist } from "../middleware/tasks"

const router = Router()

router.post('/',
    body('projectName')
    .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
    .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
    .notEmpty().withMessage('La descripcion del proyecto es obligatorio'),
    handleInputErrors,
    ProjectController.createProject
)

router.get('/', ProjectController.getAllProjects) 

router.get('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    ProjectController.getProjectById
)

router.put('/:id', 
    param('id').isMongoId().withMessage('ID no valido'),
    body('projectName')
    .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
    .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
    .notEmpty().withMessage('La descripcion del proyecto es obligatorio'),
    handleInputErrors,
    ProjectController.editProject
)

router.delete('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    ProjectController.deleteProject
)

/**Routes for task */
/**middleware to param */
router.param('projectId', validateProjectExist)


router.post('/:projectId/tasks',
    body('taskName').
        notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La description de  la tarea es obligatoria'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    TaskController.getProjectTasks
)

/**middleware to param */
router.param('taskId', validateTaskExist)
router.param('taskId', taskBelogsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    TaskController.getTaskById
)
router.put('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Id no valido'),
    body('taskName').
        notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La description de  la tarea es obligatoria'),
    handleInputErrors,
    TaskController.editTask
)
router.delete('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    TaskController.deletetask
)
router.patch('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('Id no valido'),
    body('status').notEmpty().withMessage('El status de la tarea es obligatorio'),
    handleInputErrors,
    TaskController.editTaskStatus
)


export default router