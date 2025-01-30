import mongoose, {Schema, Document, Types} from "mongoose"

const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: "inProgress",
    UNDER_REVIEW: "underReview",
    COMPLETED: "completed"
} as const


export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]

export interface ITask extends Document {
    taskName: string,
    description: string,
    project: Types.ObjectId,
    status: TaskStatus
}

const taskSchema: Schema = new Schema({
    taskName: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    project: {
        type: Types.ObjectId,
        ref: 'Project'
    },
    status:{
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
    }
}, {timestamps: true}) 

const Task = mongoose.model<ITask>('Task', taskSchema)
export default Task
