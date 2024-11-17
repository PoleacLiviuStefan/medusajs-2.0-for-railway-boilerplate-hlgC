import Product from "../product-preview"
import { getRegion } from "@lib/data/regions"
import { getRelatedProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // Verificăm dacă produsul are o colecție asociată
  if (!product.collection.id) {
    return null
  }

  // Pregătește parametrii pentru a obține produsele din aceeași colecție, excludem giftcards

  console.log("produsCurent",product)
  const queryParams: HttpTypes.StoreProductParams = {
    region_id: region.id,
    collection_id: [product.collection_id], // Căutăm doar produse din aceeași colecție
    is_giftcard: false,
  }

  // Obținem lista produselor din colecția respectivă
  const products = await getRelatedProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    // Filtrăm pentru a exclude produsul curent
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id
    )
  })

  // Dacă nu există alte produse în colecție, returnăm null pentru a nu afișa secțiunea
  if (!products.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-md lg:text-xl font-bold">
          Produse Similare
        </span>
        <p className="text-lg-regular text-gray-600 text-ui-fg-base max-w-lg">
          Descoperă mai multe produse care te-ar interesa
        </p>
      </div>

      {/* Listăm produsele similare */}
      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {products.map((relatedProduct) => (
          <li key={relatedProduct.id}>
            <Product region={region} product={relatedProduct} />
          </li>
        ))}
      </ul>
    </div>
  )
}
