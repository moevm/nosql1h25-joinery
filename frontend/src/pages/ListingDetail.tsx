import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Comments from '@/components/Comments';
import { useApp } from '@/hooks/useApp';

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { listings, comments, user } = useApp();
  
  const listing = listings.find(item => item.id === id);
  const listingComments = comments.filter(comment => comment.listingId === id);

  if (!listing) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto p-4">
          <p>Объявление не найдено</p>
          <Link to="/" className="underline">На главную</Link>
        </div>
      </div>
    );
  }

  const formattedCreatedDate = new Date(listing.createdAt).toLocaleDateString('ru-RU');
  const formattedUpdatedDate = new Date(listing.updatedAt).toLocaleDateString('ru-RU');

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl">{listing.title}</h1>
          {user && user.id === listing.masterId && (
            <Link
              to={`/edit/${listing.id}`}
              className="border border-black px-6 py-2"
            >
              Редактировать
            </Link>
          )}
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1">
            <img 
              src={listing.imageUrl} 
              alt={listing.title} 
              className="w-full h-auto object-cover mb-6"
            />
            
            <div className="border border-black p-4">
              <Link to={`/profile/${listing.masterId}`} className="block">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center border border-black">
                    <span className="text-xl">{listing.masterName.charAt(0)}</span>
                  </div>
                </div>
                <p className="text-center">{listing.masterName}</p>
              </Link>
            </div>
            
            <div className="mt-6">
              <p>Дата публикации: {formattedCreatedDate}</p>
              <p>Дата изменения: {formattedUpdatedDate}</p>
            </div>
          </div>
          
          <div className="col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl mb-4">Характеристики</h2>
              <div className="grid grid-cols-2 gap-2">
                <p>Ширина(мм): <span className="font-bold">{listing.width}</span></p>
                <p>Высота(мм): <span className="font-bold">{listing.height}</span></p>
                <p>Длина(мм): <span className="font-bold">{listing.length}</span></p>
                <p>Вес(г): <span className="font-bold">{listing.weight}</span></p>
                <p>Количество(шт): <span className="font-bold">{listing.quantity}</span></p>
                <p>Адрес: <span className="font-bold">{listing.address}</span></p>
                <p>Цена: <span className="font-bold">{listing.price}</span></p>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl mb-4">Описание</h2>
              <p>{listing.description}</p>
            </div>
            
            <Comments listingId={listing.id} comments={listingComments} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
