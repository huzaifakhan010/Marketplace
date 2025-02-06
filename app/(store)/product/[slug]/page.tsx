import { getProductsBySlug } from '@/sanity/lib/products/getProductsBySlug';
import { notFound } from 'next/navigation';
import { imageUrl } from '@/lib/imageUrl';
import Image from 'next/image';
import { PortableText } from 'next-sanity';
import AddToBasketButton from '@/components/AddToBasketButton';


export const dynamic = 'force-static';
export const revalidate = 60;

async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProductsBySlug(slug);

    console.log(crypto.randomUUID().slice(0,5)+
            `>>> Rerendered the product page cache for ${slug}`)

    if (!product) {
        return notFound();
    }

    const isOutofStock = product.stock != null && product.stock <= 0;

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div
                    className={`relative aspect-square overflow-hidden rounded-lg shadow-lg ${
                        isOutofStock ? "opacity-50" : ""
                    }`}
                >
                    {product.image && (
                        <Image
                            className='object-contain transition-transform duration-300 hover:scale-105'
                            src={imageUrl(product.image).url()}
                            alt={product.name || 'Product image'}
                            fill
                        />
                    )}
                    {isOutofStock && (
                        <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                            <span className='text-white font-bold text-lg'>
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>
                <div className='flex flex-col justify-between'>
                    <div>
                        <h1 className='text-3xl font-bold mb-4'>
                            {product.name}
                        </h1>
                        <div className='text-xl font-semibold mb-4'>
                            ${product.price?.toFixed(2)}
                        </div>
                        <div className='pose max-w-none mb-6'>
                            {Array.isArray(product.description) && (
                                <PortableText value={product.description} />
                            )}
                        </div>
                    </div>
                    <div className='mt-6'>
                        <AddToBasketButton product={product} disabled={isOutofStock}/>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductPage;
