
import { useState, useEffect } from 'react';

interface FilterProps {
  onApplyFilter: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
}

export interface FilterValues {
  title: string;
  master: string;
  width: { min: string; max: string };
  height: { min: string; max: string };
  length: { min: string; max: string };
  weight: { min: string; max: string };
  quantity: { min: string; max: string };
  price: { min: string; max: string };
  address: string;
}

type RangeFilterKey = 'width' | 'height' | 'length' | 'weight' | 'quantity' | 'price';

const defaultFilters: FilterValues = {
  title: '',
  master: '',
  width: { min: '', max: '' },
  height: { min: '', max: '' },
  length: { min: '', max: '' },
  weight: { min: '', max: '' },
  quantity: { min: '', max: '' },
  price: { min: '', max: '' },
  address: '',
};

const Filter = ({ onApplyFilter, initialFilters }: FilterProps) => {
  const [filters, setFilters] = useState<FilterValues>(initialFilters || defaultFilters);
  
  // Обновляем фильтры при изменении initialFilters
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  const handleChange = (name: string, value: string) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (child === 'min' || child === 'max') {
        const parentKey = parent as RangeFilterKey;
        setFilters({
          ...filters,
          [parentKey]: { ...filters[parentKey], [child]: value },
        });
      }
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilter(filters);
  };

  return (
    <div>
      <h2 className="text-4xl mb-4">Фильтр</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-2xl">Название</label>
          <input
            type="text"
            className="w-full border border-black p-2"
            value={filters.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-2xl">Мастер</label>
          <input
            type="text"
            className="w-full border border-black p-2"
            value={filters.master}
            onChange={(e) => handleChange('master', e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-2xl">Ширина(мм)</label>
          <div className="flex gap-2 items-center">
            <span>от</span>
            <input
              type="number"
              className="w-20 border border-black p-2"
              value={filters.width.min}
              onChange={(e) => handleChange('width.min', e.target.value)}
            />
            <span>до</span>
            <input
              type="number"
              className="w-20 border border-black p-2"
              value={filters.width.max}
              onChange={(e) => handleChange('width.max', e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-2xl">Высота(мм)</label>
          <div className="flex gap-2 items-center">
            <span>от</span>
            <input
              type="number"
              className="w-20 border border-black p-2"
              value={filters.height.min}
              onChange={(e) => handleChange('height.min', e.target.value)}
            />
            <span>до</span>
            <input
              type="number"
              className="w-20 border border-black p-2"
              value={filters.height.max}
              onChange={(e) => handleChange('height.max', e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-2xl">Длина(мм)</label>
          <div className="flex gap-2 items-center">
            <span>от</span>
            <input
              type="number"
              className="w-20 border border-black p-2"
              value={filters.length.min}
              onChange={(e) => handleChange('length.min', e.target.value)}
            />
            <span>до</span>
            <input
              type="number"
              className="w-20 border border-black p-2"
              value={filters.length.max}
              onChange={(e) => handleChange('length.max', e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-2xl">Вес(г)</label>
          <div className="flex gap-2 items-center">
            <span>от</span>
            <input
              type="number"
              className="w-20 border border-black p-2"
              value={filters.weight.min}
              onChange={(e) => handleChange('weight.min', e.target.value)}
            />
            <span>до</span>
            <input
              type="number"
              className="w-20 border border-black p-2"
              value={filters.weight.max}
              onChange={(e) => handleChange('weight.max', e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-2xl">Кол-во(шт)</label>
          <div className="flex gap-2 items-center">
            <span>от</span>
            <input
              type="number"
              className="w-20 border border-black p-2"
              value={filters.quantity.min}
              onChange={(e) => handleChange('quantity.min', e.target.value)}
            />
            <span>до</span>
            <input
              type="number"
              className="w-20 border border-black p-2"
              value={filters.quantity.max}
              onChange={(e) => handleChange('quantity.max', e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-2xl">Цена</label>
          <div className="flex gap-2 items-center">
            <span>от</span>
            <input
              type="number"
              className="w-20 border border-black p-2"
              value={filters.price.min}
              onChange={(e) => handleChange('price.min', e.target.value)}
            />
            <span>до</span>
            <input
              type="number"
              className="w-20 border border-black p-2"
              value={filters.price.max}
              onChange={(e) => handleChange('price.max', e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-2xl">Адрес</label>
          <input
            type="text"
            className="w-full border border-black p-2"
            value={filters.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="border border-black px-8 py-2 text-xl"
        >
          Отфильтровать
        </button>
      </form>
    </div>
  );
};

export default Filter;
