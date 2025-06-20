import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useReadySets } from "@/hooks/useReadySets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "./ImageUpload";
import HeroManager from "./HeroManager";
import CategoryManager from "./CategoryManager";
import FooterManager from "./FooterManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/product";
import { Plus, Edit, Trash2, Loader, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProductManager = () => {
  const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts();
  const { readySets, loading: setsLoading, createReadySet, updateReadySet, deleteReadySet } = useReadySets();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSetDialogOpen, setIsSetDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingSet, setEditingSet] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    power: '',
    lightColor: '',
    price: '',
    image: '',
    category: '' as Product['category'],
    description: ''
  });
  const [setFormDataState, setSetFormDataState] = useState({
    name: '',
    price: '',
    description: '',
    selectedProducts: [] as number[]
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: '',
      power: '',
      lightColor: '',
      price: '',
      image: '',
      category: '' as Product['category'],
      description: ''
    });
    setEditingProduct(null);
  };

  const resetSetForm = () => {
    setSetFormDataState({
      name: '',
      price: '',
      description: '',
      selectedProducts: []
    });
    setEditingSet(null);
  };

  const openEditSetDialog = (set: any) => {
    setEditingSet(set);
    setSetFormDataState({
      name: set.name,
      price: set.price.toString(),
      description: set.description,
      selectedProducts: set.product_ids
    });
    setIsSetDialogOpen(true);
  };

  const openCreateSetDialog = () => {
    resetSetForm();
    setIsSetDialogOpen(true);
  };

  const handleSetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setFormDataState.name || !setFormDataState.price || !setFormDataState.description || setFormDataState.selectedProducts.length === 0) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля и выберите хотя бы один товар",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const setData = {
        name: setFormDataState.name,
        price: parseInt(setFormDataState.price),
        description: setFormDataState.description,
        product_ids: setFormDataState.selectedProducts
      };

      if (editingSet) {
        await updateReadySet(editingSet.id, setData);
        toast({
          title: "Успешно",
          description: "Набор обновлен"
        });
      } else {
        await createReadySet(setData);
        toast({
          title: "Успешно",
          description: "Набор создан"
        });
      }

      setIsSetDialogOpen(false);
      resetSetForm();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Ошибка сохранения",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetDelete = async (id: number) => {
    if (!confirm('Удалить этот набор?')) return;

    try {
      await deleteReadySet(id);
      toast({
        title: "Успешно",
        description: "Набор удален"
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Ошибка удаления",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      power: product.power,
      lightColor: product.lightColor,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      description: product.description || ''
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.power || !formData.lightColor || !formData.price || !formData.category) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const productData = {
        name: formData.name,
        power: formData.power,
        lightColor: formData.lightColor,
        price: parseInt(formData.price),
        image: formData.image,
        category: formData.category,
        compatibleWith: [],
        description: formData.description
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast({
          title: "Успешно",
          description: "Товар обновлен"
        });
      } else {
        await createProduct(productData);
        toast({
          title: "Успешно",
          description: "Товар создан"
        });
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Ошибка сохранения",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить этот товар?')) return;

    try {
      await deleteProduct(id);
      toast({
        title: "Успешно",
        description: "Товар удален"
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Ошибка удаления",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Панель администратора</h1>
      
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="products">Товары</TabsTrigger>
          <TabsTrigger value="sets">Готовые наборы</TabsTrigger>
          <TabsTrigger value="categories">Категории</TabsTrigger>
          <TabsTrigger value="hero">Hero блок</TabsTrigger>
          <TabsTrigger value="footer">Футер</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Управление товарами</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить товар
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Название *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Название товара"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="power">Мощность *</Label>
                  <Input
                    id="power"
                    value={formData.power}
                    onChange={(e) => setFormData(prev => ({ ...prev, power: e.target.value }))}
                    placeholder="9W"
                  />
                </div>
                <div>
                  <Label htmlFor="lightColor">Цвет света *</Label>
                  <Select
                    value={formData.lightColor}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, lightColor: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите цвет" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Теплый">Теплый</SelectItem>
                      <SelectItem value="Холодный">Холодный</SelectItem>
                      <SelectItem value="Нейтральный">Нейтральный</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Цена (₽) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Категория *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: Product['category']) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="led">LED лампы</SelectItem>
                      <SelectItem value="emergency">Аварийные лампы</SelectItem>
                      <SelectItem value="decorative">Декоративные лампы</SelectItem>
                      <SelectItem value="set">Готовые наборы</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Изображение</Label>
                <ImageUpload
                  currentImage={formData.image}
                  onImageUpload={(url) => setFormData(prev => ({ ...prev, image: url }))}
                />
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Дополнительная информация о товаре"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader className="h-4 w-4 mr-2 animate-spin" />}
                  {editingProduct ? 'Обновить' : 'Создать'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group">
            <CardContent className="p-4">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{product.price} ₽</Badge>
                  <span className="text-sm text-muted-foreground">{product.power}</span>
                </div>
                <p className="text-sm text-muted-foreground">{product.lightColor}</p>
                {product.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
    </TabsContent>

    <TabsContent value="sets" className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Управление готовыми наборами</h2>
          <Dialog open={isSetDialogOpen} onOpenChange={setIsSetDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateSetDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить набор
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSet ? 'Редактировать набор' : 'Добавить набор'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSetSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="setName">Название *</Label>
                  <Input
                    id="setName"
                    value={setFormDataState.name}
                    onChange={(e) => setSetFormDataState(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Название набора"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="setPrice">Цена (₽) *</Label>
                    <Input
                      id="setPrice"
                      type="number"
                      value={setFormDataState.price}
                      onChange={(e) => setSetFormDataState(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="1000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="setDescription">Описание *</Label>
                  <Textarea
                    id="setDescription"
                    value={setFormDataState.description}
                    onChange={(e) => setSetFormDataState(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Описание набора"
                  />
                </div>

                <div>
                  <Label>Товары в наборе *</Label>
                  <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center space-x-3">
                        <Checkbox
                          id={`product-${product.id}`}
                          checked={setFormDataState.selectedProducts.includes(product.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSetFormDataState(prev => ({
                                ...prev,
                                selectedProducts: [...prev.selectedProducts, product.id]
                              }));
                            } else {
                              setSetFormDataState(prev => ({
                                ...prev,
                                selectedProducts: prev.selectedProducts.filter(id => id !== product.id)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={`product-${product.id}`} className="flex items-center gap-2 cursor-pointer">
                          {product.image && (
                            <img src={product.image} alt={product.name} className="w-8 h-8 object-cover rounded" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.price} ₽ • {product.power}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader className="h-4 w-4 mr-2 animate-spin" />}
                    {editingSet ? 'Обновить' : 'Создать'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsSetDialogOpen(false)}
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {setsLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {readySets.map((set) => {
              const setProducts = set.product_ids.map(id => products.find(p => p.id === id)).filter(Boolean);
              
              return (
                <Card key={set.id} className="group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Package className="h-8 w-8 text-primary" />
                      <Badge variant="default" className="text-lg font-bold">
                        {set.price} ₽
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{set.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{set.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">В наборе ({setProducts.length} товаров):</h4>
                      {setProducts.map((product) => (
                        <div key={product.id} className="flex items-center gap-3 p-2 bg-secondary/30 rounded text-xs">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-muted-foreground">{product.power} • {product.lightColor}</p>
                          </div>
                          <span className="font-medium">{product.price} ₽</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditSetDialog(set)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleSetDelete(set.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </TabsContent>
        
        <TabsContent value="categories">
          <CategoryManager />
        </TabsContent>
        
        <TabsContent value="hero">
          <HeroManager />
        </TabsContent>
        
        <TabsContent value="footer">
          <FooterManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductManager;