export const MediaModel = {
    async getAll() {
        const { data, error } = await supabase.from('media').select('*');
        if (error) throw error;
        return data;
    },

    async getById(id) {
        const { data, error } = await supabase.from('media').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    async create({ title, url, type }) {
        const { data, error } = await supabase.from('media').insert([{ title, url, type }]);
        if (error) throw error;
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase.from('media').update(updates).eq('id', id);
        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { data, error } = await supabase.from('media').delete().eq('id', id);
        if (error) throw error;
        return data;
    }
};