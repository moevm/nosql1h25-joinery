import { Link } from 'react-router-dom';
import { ListingItem } from '@/types';

interface ListingCardProps {
  listing: ListingItem;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  return (
    <Link to={`/listing/${listing.id}`} className="block">
      <div className="border border-black p-4 mb-4 flex">
        <div className="w-1/3">
          <img src={listing.imageUrl} alt={listing.title} className="w-full h-36 object-cover" />
        </div>
        <div className="w-2/3 pl-4">
          <h2 className="text-3xl font-bold">{listing.title}</h2>
          <div className="grid grid-cols-2">
            <div>
              <p>Ширина(мм): {listing.width}</p>
              <p>Высота(мм): {listing.height}</p>
              <p>Длина(мм): {listing.length}</p>
              <p>Вес(г): {listing.weight}</p>
              <p>Количество(шт): {listing.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">Мастер</p>
              <p>{listing.masterName}</p>
              <p className="font-bold">Цена</p>
              <p>{listing.price}</p>
              <p className="font-bold">Адрес</p>
              <p>{listing.address}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
