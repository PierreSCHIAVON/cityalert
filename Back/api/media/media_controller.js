import { supabase } from './supabaseClient.js'
import multer from 'multer'
import { randomUUID } from 'crypto'

// Config Multer (stockage en mémoire)
const storage = multer.memoryStorage()
export const upload = multer({ storage })

/**
 * GET /api/media
 */
export const getAllMedia = async (req, res) => {
    const { data, error } = await supabase.from('media').select('*')
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
}

/**
 * GET /api/media/:id
 */
export const getMediaById = async (req, res) => {
    const { id } = req.params
    const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('id', id)
        .single()

    if (error) return res.status(404).json({ error: 'Média non trouvé' })
    res.json(data)
}

/**
 * POST /api/media
 * multipart/form-data
 * Champs : fichier, type, alerteId
 */
export const createMedia = async (req, res) => {
    const { type, alerteId } = req.body

    if (!req.file)
        return res.status(400).json({ error: 'Aucun fichier reçu' })

    if (!type || !alerteId)
        return res.status(400).json({ error: 'type et alerteId sont obligatoires' })

    // Génération nom unique
    const extension = req.file.originalname.split('.').pop()
    const fileName = `media_${randomUUID()}.${extension}`

    // Upload dans Supabase Storage
    const { error: uploadError } = await supabase.storage
        .from('medias')
        .upload(fileName, req.file.buffer, {
            contentType: req.file.mimetype,
        })

    if (uploadError)
        return res.status(500).json({ error: uploadError.message })

    // Récupération URL publique
    const { data: urlData } = supabase.storage
        .from('medias')
        .getPublicUrl(fileName)

    const publicUrl = urlData.publicUrl

    // Insertion dans la table media
    const { data, error } = await supabase.from('media').insert([
        {
            url: publicUrl,
            type,
            alerteId: Number(alerteId),
        }
    ]).select()

    if (error)
        return res.status(500).json({ error: error.message })

    res.status(201).json(data[0])
}

/**
 * DELETE /api/media/:id
 */
export const deleteMedia = async (req, res) => {
    const { id } = req.params

    // On récupère l'URL pour supprimer aussi dans le Storage
    const { data: media, error: findError } = await supabase
        .from('media')
        .select('*')
        .eq('id', id)
        .single()

    if (findError)
        return res.status(404).json({ error: 'Média non trouvé' })

    // Extraire le nom du fichier depuis l'URL
    const filePath = media.url.split('/').pop()

    // Supprimer fichier du Storage
    await supabase.storage
        .from('medias')
        .remove([filePath])

    // Supprimer en BDD
    const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id)

    if (error)
        return res.status(500).json({ error: error.message })

    res.status(204).send()
}
