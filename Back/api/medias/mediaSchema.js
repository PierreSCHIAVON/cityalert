const z = require('zod');

const MediaInputSchema = z.object({
    id_alert: z.number({
        invalid_type_error: "id_alert doit être un nombre entier.",
        required_error: "id_alert est requis."
    }).int().positive(),

    user_id: z.number({
        invalid_type_error: "user_id doit être un nombre entier.",
        required_error: "user_id est requis."
    }).int().positive(),

    file_url: z.string({
        required_error: "file_url est requis."
    }).url("file_url doit être une URL valide.").max(255), // Max 255 caractères selon @db.VarChar(255)

    file_type: z.string().max(50).optional().or(z.literal('')), // Gère 'undefined' ou chaîne vide
});

const MediaUpdateSchema = MediaInputSchema.partial();

module.exports = {
    MediaInputSchema,
    MediaUpdateSchema,
};