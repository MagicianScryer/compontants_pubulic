import { useState, useEffect } from 'react';
import { RbRing } from '@components/rbring/RbRing';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';

const Component = (props) => {

  const [products, setProducts] = useState([]);
  const responsiveOptions = [
      {
          breakpoint: '1400px',
          numVisible: 2,
          numScroll: 1
      },
      {
          breakpoint: '1199px',
          numVisible: 3,
          numScroll: 1
      },
      {
          breakpoint: '767px',
          numVisible: 2,
          numScroll: 1
      },
      {
          breakpoint: '575px',
          numVisible: 1,
          numScroll: 1
      }
  ];

  const getSeverity = (product) => {
    switch (product.inventoryStatus) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warning';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
  };

  useEffect(() => {
    const data = [];
    for (let i = 0; i < 3; i++) {
      data.push({
        id: i,
        code: 'f230fh0g3',
        name: 'Bamboo Watch',
        description: 'Product Description',
        image: 'bamboo-watch.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        rating: 5
      })
    }
    setProducts(data);
  }, []);

  const productTemplate = (product) => {
    return (
        <div className="border-1 surface-border border-round m-2 text-center py-5 px-3">
            <div className="mb-3">
                <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.name} className="w-6 shadow-2" />
            </div>
            <div>
                <h4 className="mb-1">{product.name}</h4>
                <h6 className="mt-0 mb-3">${product.price}</h6>
            </div>
        </div>
    );
  };

  return (
    <div className='card'>
      <RbRing value={products} numColumn={3} numRow={2} itemTemplate={productTemplate}></RbRing>
    </div>
  )
}

export default Component;