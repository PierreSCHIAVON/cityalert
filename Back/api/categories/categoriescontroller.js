const prisma = require("../../lib/prisma");

exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({
      where: { id_category: parseInt(id, 10) },
    });

    if (!category) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }

    res.json(category);
  } catch (error) {
    console.error("Erreur lors de la récupération de la catégorie:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.createCategory = async (req, res) => {
  const { title } = req.body;

  try {
    const newCategory = await prisma.category.create({
      data: { title },
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const updatedCategory = await prisma.category.update({
      where: { id_category: parseInt(id, 10) },
      data: { title },
    });

    res.json(updatedCategory);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la catégorie:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.category.delete({
      where: { id_category: parseInt(id, 10) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Erreur lors de la suppression de la catégorie:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
