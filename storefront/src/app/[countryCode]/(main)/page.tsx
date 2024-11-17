import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { getCollectionsWithProducts } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import TopSellingProducts from "@modules/store/templates/top-selling-products"

export const metadata: Metadata = {
  title: "Lorena Lash",
  description:
    "Magazin Online",
}

export default async function Home({
  params: { countryCode },
}: {
  params: { countryCode: string }
}) {

  const collections = await getCollectionsWithProducts(countryCode)
  console.log("collections",collections)
  const region = await getRegion(countryCode)

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <div className="flex justify-center w-full lpy-12">
        <ul className="flex flex-col gap-x-6 lg:w-[900px]">
          <FeaturedProducts collections={collections} region={region} />
     
        </ul>
      </div>
    </>
  )
}
