
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Filter, { FilterValues } from '@/components/Filter';
import ListingCard from '@/components/ListingCard';
import { useApp } from '@/hooks/useApp';
import { ListingItem } from '@/types';

const Home = () => {
  const { listings, loading, fetchListings } = useApp();
  const [filteredListings, setFilteredListings] = useState<ListingItem[]>([]);
  const [sortOption, setSortOption] = useState('price');
  const [filters, setFilters] = useState<FilterValues>({
    title: '',
    master: '',
    width: { min: '', max: '' },
    height: { min: '', max: '' },
    length: { min: '', max: '' },
    weight: { min: '', max: '' },
    quantity: { min: '', max: '' },
    price: { min: '', max: '' },
    address: '',
  });
  
  // Получаем параметры запроса из URL
  const location = useLocation();
  
  // Извлекаем параметр master из URL при загрузке страницы
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const masterParam = queryParams.get('master');
    
    if (masterParam) {
      // Обновляем фильтры с учетом параметра master из URL
      const updatedFilters = {
        ...filters,
        master: masterParam
      };
      
      setFilters(updatedFilters);
      
      // Применяем фильтр
      fetchListings(updatedFilters);
    } else {
      // Если параметров нет, загружаем все объявления
      fetchListings(filters);
    }
  }, [location.search]);

  // При загрузке компонента и изменении списка объявлений обновляем отфильтрованный список
  useEffect(() => {
    setFilteredListings(listings);
  }, [listings]);

  const handleApplyFilter = (newFilters: FilterValues) => {
    // Сохраняем новые фильтры
    setFilters(newFilters);
    // Отправляем запрос на сервер с фильтрами
    fetchListings(newFilters);
  };

  const sortListings = (option: string) => {
    setSortOption(option);
    let sorted = [...filteredListings];

    switch (option) {
      case 'price':
        sorted = sorted.sort((a, b) => a.price - b.price);
        break;
      case 'date':
        sorted = sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }

    setFilteredListings(sorted);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto p-4">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/3 px-4">
            <Filter onApplyFilter={handleApplyFilter} initialFilters={filters} />
          </div>
          <div className="w-full md:w-2/3 px-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-4xl">Объявления</h2>
              <div className="flex items-center">
                <span>Сортировка: </span>
                <select 
                  value={sortOption}
                  onChange={(e) => sortListings(e.target.value)}
                  className="border border-black p-1 ml-2"
                >
                  <option value="price">по цене</option>
                  <option value="date">по дате</option>
                </select>
                <span className="ml-8">Кол-во: {filteredListings.length}</span>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-10">Загрузка объявлений...</div>
            ) : filteredListings.length > 0 ? (
              <div>
                {filteredListings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">Нет доступных объявлений</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
