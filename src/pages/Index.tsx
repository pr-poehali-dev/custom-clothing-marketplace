import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeSection, setActiveSection] = useState('home');

  const products: Product[] = [
    { id: 1, name: 'Классическая рубашка', price: 7500, category: 'Рубашки', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400' },
    { id: 2, name: 'Брюки slim-fit', price: 8900, category: 'Брюки', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400' },
    { id: 3, name: 'Пиджак casual', price: 15900, category: 'Пиджаки', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400' },
    { id: 4, name: 'Платье-футляр', price: 9500, category: 'Платья', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400' },
    { id: 5, name: 'Костюм двойка', price: 22000, category: 'Костюмы', image: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=400' },
    { id: 6, name: 'Блуза шелковая', price: 6800, category: 'Блузы', image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400' },
  ];

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === productId 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'catalog', label: 'Каталог', icon: 'ShoppingBag' },
    { id: 'account', label: 'Личный кабинет', icon: 'User' },
    { id: 'delivery', label: 'Доставка', icon: 'Truck' },
    { id: 'payment', label: 'Оплата', icon: 'CreditCard' },
    { id: 'contacts', label: 'Контакты', icon: 'Phone' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-primary">Atelier</h1>
            
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    activeSection === item.id ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map(item => (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                              <div className="flex-1">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">{item.price.toLocaleString('ru-RU')} ₽</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.id, -1)}>
                                    <Icon name="Minus" size={12} />
                                  </Button>
                                  <span className="text-sm w-8 text-center">{item.quantity}</span>
                                  <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}>
                                    <Icon name="Plus" size={12} />
                                  </Button>
                                  <Button size="icon" variant="ghost" className="h-6 w-6 ml-auto" onClick={() => removeFromCart(item.id)}>
                                    <Icon name="Trash2" size={12} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-medium">Итого:</span>
                          <span className="text-2xl font-bold">{totalAmount.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <Button className="w-full" size="lg">Оформить заказ</Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-primary leading-tight">
                Одежда на заказ<br />по вашим меркам
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Создаем качественные вещи с индивидуальным подходом. Классический крой, проверенные материалы, доступные цены.
              </p>
              <Button size="lg" className="text-base px-8" onClick={() => setActiveSection('catalog')}>
                Смотреть каталог
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold mb-12 text-center">Наши преимущества</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: 'Ruler', title: 'Точная посадка', desc: 'Индивидуальный пошив по вашим меркам' },
                { icon: 'Sparkles', title: 'Качество', desc: 'Премиальные ткани и фурнитура' },
                { icon: 'Clock', title: 'Быстро', desc: 'Изготовление за 7-14 дней' },
              ].map((item, i) => (
                <Card key={i} className="border-border hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name={item.icon as any} size={24} className="text-primary" />
                    </div>
                    <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold mb-12 text-center">Популярные модели</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <Card key={product.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="relative overflow-hidden aspect-square">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 right-3 bg-white/90 text-primary hover:bg-white">
                      {product.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold mb-2">{product.name}</h4>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-2xl font-bold">{product.price.toLocaleString('ru-RU')} ₽</span>
                      <Button onClick={() => addToCart(product)} size="sm">
                        <Icon name="ShoppingCart" size={16} className="mr-2" />
                        В корзину
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-4">Готовы сделать заказ?</h3>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Свяжитесь с нами для консультации и снятия мерок. Мы поможем подобрать идеальный вариант.
            </p>
            <Button size="lg" variant="secondary">
              <Icon name="Phone" size={20} className="mr-2" />
              Связаться с нами
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">Atelier</h4>
              <p className="text-sm text-muted-foreground">Индивидуальный пошив одежды премиум-качества</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Разделы</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => setActiveSection('catalog')} className="hover:text-primary">Каталог</button></li>
                <li><button onClick={() => setActiveSection('delivery')} className="hover:text-primary">Доставка</button></li>
                <li><button onClick={() => setActiveSection('payment')} className="hover:text-primary">Оплата</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Контакты</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>+7 (495) 123-45-67</li>
                <li>info@atelier.ru</li>
                <li>Пн-Пт: 10:00 - 20:00</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Мы в соцсетях</h5>
              <div className="flex gap-3">
                {['Instagram', 'Facebook', 'Twitter'].map(social => (
                  <button key={social} className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                    <Icon name="Share2" size={16} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 Atelier. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
