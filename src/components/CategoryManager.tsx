import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/types/category";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Loader2 } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";

const CategoryManager = () => {
  const { categories, loading, updateCategory } = useCategories();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const handleEdit = (category: Category) => {
    setEditingCategory({ ...category });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingCategory) return;

    try {
      setUpdating(true);
      await updateCategory(editingCategory.id, {
        title: editingCategory.title,
        description: editingCategory.description,
        image_url: editingCategory.image_url,
        alt_text: editingCategory.alt_text,
        count_text: editingCategory.count_text
      });

      toast({
        title: "Успешно",
        description: "Категория обновлена"
      });

      setIsDialogOpen(false);
      setEditingCategory(null);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Ошибка обновления категории",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleImageUpload = (url: string) => {
    if (editingCategory) {
      setEditingCategory({
        ...editingCategory,
        image_url: url
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Управление категориями</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="p-4">
            <div className="space-y-3">
              {category.image_url && (
                <img
                  src={category.image_url}
                  alt={category.alt_text || category.title}
                  className="w-full h-32 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-semibold">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{category.count_text}</p>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                    className="w-full"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Редактировать
                  </Button>
                </DialogTrigger>
                
                {editingCategory?.id === category.id && (
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Редактировать категорию</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Название</Label>
                        <Input
                          id="title"
                          value={editingCategory.title}
                          onChange={(e) => setEditingCategory({
                            ...editingCategory,
                            title: e.target.value
                          })}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Описание</Label>
                        <Input
                          id="description"
                          value={editingCategory.description}
                          onChange={(e) => setEditingCategory({
                            ...editingCategory,
                            description: e.target.value
                          })}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="count_text">Количество товаров</Label>
                        <Input
                          id="count_text"
                          value={editingCategory.count_text}
                          onChange={(e) => setEditingCategory({
                            ...editingCategory,
                            count_text: e.target.value
                          })}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="alt_text">Alt-текст для изображения</Label>
                        <Textarea
                          id="alt_text"
                          value={editingCategory.alt_text || ''}
                          onChange={(e) => setEditingCategory({
                            ...editingCategory,
                            alt_text: e.target.value
                          })}
                          placeholder="Описание изображения для SEO и доступности"
                        />
                      </div>
                      
                      <div>
                        <Label>Изображение категории</Label>
                        <ImageUpload
                          currentImage={editingCategory.image_url || ''}
                          onImageUpload={handleImageUpload}
                        />
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={handleSave}
                          disabled={updating}
                          className="flex-1"
                        >
                          {updating ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Сохранение...
                            </>
                          ) : (
                            'Сохранить'
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                          disabled={updating}
                        >
                          Отмена
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                )}
              </Dialog>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;