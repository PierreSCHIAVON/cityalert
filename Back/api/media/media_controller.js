import { supabase } from './supabaseClient.js'

export const getAllMedia = async (req, res) => {
    const { data, error } = await supabase.from('media').select('*')
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
}

export const getMediaById = async (req, res) => {
    const { id } = req.params
    const { data, error } = await supabase.from('media').select('*').eq('id', id).single()
    if (error) return res.status(404).json({ error: error.message })
    res.json(data)
}

export const createMedia = async (req, res) => {
    const { title, url, type } = req.body
    const { data, error } = await supabase.from('media').insert([{ title, url, type }])
    if (error) return res.status(400).json({ error: error.message })
    res.status(201).json(data)
}

export const updateMedia = async (req, res) => {
    const { id } = req.params
    const updates = req.body
    const { data, error } = await supabase.from('media').update(updates).eq('id', id)
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
}

export const deleteMedia = async (req, res) => {
    const { id } = req.params
    const { data, error } = await supabase.from('media').delete().eq('id', id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ message: 'Media supprimé', data })
}
