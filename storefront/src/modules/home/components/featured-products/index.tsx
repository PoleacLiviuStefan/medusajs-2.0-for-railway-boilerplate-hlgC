import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  collections,
  region,
  main=false
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
  main?: boolean
}) {

  console.log("collections ", collections);
  return collections.map((collection) => (
    <li key={collection.id}>
      <ProductRail collection={collection} region={region} main={main} />
    </li>
  ))
}
