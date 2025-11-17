import express from 'express'
import {
    getAllMedia,
    getMediaById,
    createMedia,
    deleteMedia,
    upload
} from './media_controller.js'

const router = express.Router()

router.get('/', getAllMedia)
router.get('/:id', getMediaById)
router.post('/', upload.single('fichier'), createMedia)
router.delete('/:id', deleteMedia)

export default router
