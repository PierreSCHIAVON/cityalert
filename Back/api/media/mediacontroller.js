import express from 'express'
import { supabase } from './supabaseClient.js'

const router = express.Router()

router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('media').select('*')
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    const { data, error } = await supabase.from('media').select('*').eq('id', id).single()
    if (error) return res.status(404).json({ error: error.message })
    res.json(data)
})

router.post('/', async (req, res) => {
    const { title, url, type } = req.body
    const { data, error } = await supabase.from('media').insert([{ title, url, type }])
    if (error) return res.status(400).json({ error: error.message })
    res.status(201).json(data)
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const updates = req.body
    const { data, error } = await supabase.from('media').update(updates).eq('id', id)
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    const { data, error } = await supabase.from('media').delete().eq('id', id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ message: 'Media supprimé', data })
})
export default router
