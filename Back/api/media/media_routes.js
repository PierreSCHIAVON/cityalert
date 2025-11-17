import express from 'express'
import * as mediaController from './media_controller.js'

const router = express.Router()

router.get('/', mediaController.getAllMedia)
router.get('/:id', mediaController.getMediaById)
router.post('/', mediaController.createMedia)
router.put('/:id', mediaController.updateMedia)
router.delete('/:id', mediaController.deleteMedia)

export default router
