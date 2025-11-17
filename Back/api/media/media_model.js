export const Media_model = {
    async getAll() {
        const { data, error } = await supabase
            .from('media')
            .select('*');

        if (error) throw new Error(error.message);
        return data;
    },

    async getById(id) {
        const { data, error } = await supabase
            .from('media')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code === "PGRST116") {
            // Not found
            return null;
        }
        if (error) throw new Error(error.message);

        return data;
    },

    async create({ title, url, type }) {
        // Le swagger dit multipart/form-data donc tu gères déjà l'upload côté controller
        const { data, error } = await supabase
            .from('media')
            .insert([{ title, url, type }])
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    },

    async delete(id) {
        const { data, error } = await supabase
            .from('media')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error && error.code === "PGRST116") {
            // Not found
            return null;
        }
        if (error) throw new Error(error.message);

        return data;
    }
};
