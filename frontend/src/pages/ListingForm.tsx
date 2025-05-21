
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import { useApp } from '@/hooks/useApp';
import FormHeader from '@/components/listings/FormHeader';
import TitleInput from '@/components/listings/TitleInput';
import DescriptionInput from '@/components/listings/DescriptionInput';
import ListingMetadata from '@/components/listings/ListingMetadata';
import ImageUploader from '@/components/listings/ImageUploader';
import FormActions from '@/components/listings/FormActions';
import { toast } from '@/components/ui/use-toast';

const ListingForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listings, createListing, updateListing, deleteListing, user } = useApp();
  
  const isEdit = !!id;
  const listing = isEdit ? listings.find(item => item.id === id) : null;
  
  const [title, setTitle] = useState(listing?.title || '');
  const [width, setWidth] = useState(listing?.width?.toString() || '');
  const [height, setHeight] = useState(listing?.height?.toString() || '');
  const [length, setLength] = useState(listing?.length?.toString() || '');
  const [weight, setWeight] = useState(listing?.weight?.toString() || '');
  const [quantity, setQuantity] = useState(listing?.quantity?.toString() || '');
  const [price, setPrice] = useState(listing?.price?.toString() || '');
  const [address, setAddress] = useState(listing?.address || '');
  const [description, setDescription] = useState(listing?.description || '');
  const [image, setImage] = useState(listing?.imageUrl || '');
  
  useEffect(() => {
    if (isEdit && !user) {
      navigate('/login');
    }

    if (isEdit && listing && user && listing.masterId !== user.id) {
      navigate('/');
    }
  }, [isEdit, listing, user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast({
        title: "Ошибка",
        description: "Название объявления обязательно",
        variant: "destructive"
      });
      return;
    }
    
    if (!image) {
      toast({
        title: "Ошибка",
        description: "Добавьте изображение к объявлению",
        variant: "destructive"
      });
      return;
    }
    
    const listingData = {
      title,
      width: parseInt(width) || 0,
      height: parseInt(height) || 0,
      length: parseInt(length) || 0,
      weight: parseInt(weight) || 0,
      quantity: parseInt(quantity) || 0,
      price: parseInt(price) || 0,
      address,
      description,
      imageUrl: image,
    };
    
    if (isEdit && id) {
      updateListing(id, listingData);
      toast({
        title: "Успешно",
        description: "Объявление обновлено"
      });
      navigate(`/listing/${id}`);
    } else {
      createListing(listingData);
      toast({
        title: "Успешно",
        description: "Объявление создано"
      });
      navigate('/');
    }
  };
  
  const handleDelete = () => {
    if (isEdit && id && window.confirm('Вы уверены, что хотите удалить это объявление?')) {
      deleteListing(id);
      navigate('/');
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <FormHeader isEdit={isEdit} />
        
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
          <TitleInput 
            title={title} 
            setTitle={setTitle} 
            isEdit={isEdit} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <DescriptionInput 
              description={description} 
              setDescription={setDescription} 
              isEdit={isEdit} 
            />
            
            <ListingMetadata 
              width={width}
              setWidth={setWidth}
              height={height}
              setHeight={setHeight}
              length={length}
              setLength={setLength}
              weight={weight}
              setWeight={setWeight}
              quantity={quantity}
              setQuantity={setQuantity}
              price={price}
              setPrice={setPrice}
              address={address}
              setAddress={setAddress}
            />
          </div>
          
          <div className="mb-10">
            <h3 className="text-lg font-semibold mb-4">Фото объявления</h3>
            <ImageUploader 
              setImage={setImage} 
              currentImage={image}
              label="Загрузите изображение или укажите ссылку"
            />
          </div>
          
          <FormActions isEdit={isEdit} handleDelete={handleDelete} />
        </form>
      </div>
    </div>
  );
};

export default ListingForm;
