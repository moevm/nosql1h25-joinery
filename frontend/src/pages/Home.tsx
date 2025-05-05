import { useState } from 'react';
import Header from '@/components/Header';
import Filter, { FilterValues } from '@/components/Filter';
import ListingCard from '@/components/ListingCard';
import { useApp } from '@/hooks/useApp';

const Home = () => {
  const { listings } = useApp();
  const [filteredListings, setFilteredListings] = useState(listings);
  const [sortOption, setSortOption] = useState('price');

  const handleApplyFilter = (filters: FilterValues) => {
    const filtered = listings.filter(listing => {
      // Фильтрация по названию
      if (filters.title && !listing.title.toLowerCase().includes(filters.title.toLowerCase())) {
        return false;
      }

      // Фильтрация по мастеру
      if (filters.master && !listing.masterName.toLowerCase().includes(filters.master.toLowerCase())) {
        return false;
      }

      // Фильтрация по ширине
      if (filters.width.min && listing.width < parseInt(filters.width.min)) {
        return false;
      }
      if (filters.width.max && listing.width > parseInt(filters.width.max)) {
        return false;
      }

      // Фильтрация по высоте
      if (filters.height.min && listing.height < parseInt(filters.height.min)) {
        return false;
      }
      if (filters.height.max && listing.height > parseInt(filters.height.max)) {
        return false;
      }

      // Фильтрация по длине
      if (filters.length.min && listing.length < parseInt(filters.length.min)) {
        return false;
      }
      if (filters.length.max && listing.length > parseInt(filters.length.max)) {
        return false;
      }

      // Фильтрация по весу
      if (filters.weight.min && listing.weight < parseInt(filters.weight.min)) {
        return false;
      }
      if (filters.weight.max && listing.weight > parseInt(filters.weight.max)) {
        return false;
      }

      // Фильтрация по количеству
      if (filters.quantity.min && listing.quantity < parseInt(filters.quantity.min)) {
        return false;
      }
      if (filters.quantity.max && listing.quantity > parseInt(filters.quantity.max)) {
        return false;
      }

      // Фильтрация по цене
      if (filters.price.min && listing.price < parseInt(filters.price.min)) {
        return false;
      }
      if (filters.price.max && listing.price > parseInt(filters.price.max)) {
        return false;
      }

      // Фильтрация по адресу
      if (filters.address && !listing.address.toLowerCase().includes(filters.address.toLowerCase())) {
        return false;
      }

      return true;
    });

    setFilteredListings(filtered);
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
            <Filter onApplyFilter={handleApplyFilter} />
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
            
            <div>
              {filteredListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
