import connectToDatabase from '../../../utils/dbConnect'
import Project from '../../../models/project'
import { DateTime } from 'luxon'

export default async function handler(req, res) {
    const { method } = req
    connectToDatabase()

    switch (method) {
        case 'GET':
            try {
                const projects = await Project.find()
                return res.status(200).json(projects)
            } catch (err) {
                return res.status(500).json({ message: 'Projects Not found' })
            }
            break
        case 'POST':
            const { title, technologies, details, admin } = req.body
            if (title == undefined) {
                return res
                    .status(400)
                    .send({ error: 'Title parameter is required' })
            }
            if (technologies == undefined) {
                return res
                    .status(400)
                    .send({ error: 'Technologies parameter is required' })
            }
            if (details == undefined) {
                return res
                    .status(400)
                    .send({ error: 'Details parameter is required' })
            }
            if (typeof title !== 'string') {
                return res
                    .status(400)
                    .send({ error: 'Title parameter should be string' })
            }
            if (title.length < 5 || title.length > 21) {
                return res.status(400).send({
                    error: 'Title parameter length should be between 5 to 20',
                })
            }
            if (technologies.length < 1) {
                return res.status(400).send({
                    error: 'At least one technology should be selected',
                })
            }
            if (details.length > 80) {
                return res.status(400).send({
                    error: 'Description should be less than 800 characters',
                })
            }
            try {
                const project = new Project(req.body)
                project.admin = admin
                const now = DateTime.now()
                project.datePosted = now
                project.expiresIn = now.plus({ month: 1 })
                console.log(project)
                await project.save()
                return res.status(200).json(project)
            } catch (err) {
                return res.status(500).json(err)
            }
            break
        default:
            return res
                .status(400)
                .json({ message: 'Method type not supported' })
    }
}
