import { FC } from 'react';
import { Input } from '@/components/ui/input';

interface ListingMetadataProps {
  width: string;
  setWidth: (width: string) => void;
  height: string;
  setHeight: (height: string) => void;
  length: string;
  setLength: (length: string) => void;
  weight: string;
  setWeight: (weight: string) => void;
  quantity: string;
  setQuantity: (quantity: string) => void;
  price: string;
  setPrice: (price: string) => void;
  address: string;
  setAddress: (address: string) => void;
}

const ListingMetadata: FC<ListingMetadataProps> = ({
  width,
  setWidth,
  height,
  setHeight,
  length,
  setLength,
  weight,
  setWeight,
  quantity,
  setQuantity,
  price,
  setPrice,
  address,
  setAddress,
}) => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Высота (мм)</label>
          <Input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full border-2 border-black p-2"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Вес (кг)</label>
          <Input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full border-2 border-black p-2"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Ширина (мм)</label>
          <Input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="w-full border-2 border-black p-2"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Кол-во</label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border-2 border-black p-2"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Длина (мм)</label>
          <Input
            type="number"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full border-2 border-black p-2"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Цена (р)</label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border-2 border-black p-2"
            required
          />
        </div>
        
        <div className="col-span-2">
          <label className="block mb-1 font-medium">Адрес</label>
          <Input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border-2 border-black p-2"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default ListingMetadata;
