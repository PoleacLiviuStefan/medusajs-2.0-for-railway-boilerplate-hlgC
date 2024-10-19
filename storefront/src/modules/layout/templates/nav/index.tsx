import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import { getCollectionsList } from "@lib/data/collections"
import { RxAvatar } from "react-icons/rx"
import { MdOutlineShoppingCart } from "react-icons/md"
import HamburgerMenu from "./HamburgerMenu"
import MovingText from "./MovingText"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  const { collections } = await getCollectionsList()

  const SideMenuItems = {
    Magazin: "/",
    "Cursuri Profesionale": "/cursuri",
    "Despre Noi": "/despre-noi",
    Contact: "/contact",

  }

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="flex flex-col justify-center relative h-[50px] lg:h-[80px] mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="flex justify-center lg:justify-between content-container txt-xsmall-plus text-ui-fg-subtle items-center w-full mt-[8px] gap-[8px] px-4 py-2 lg:w-[900px] lg:px-0">
          {/* Adăugăm componenta HamburgerMenu pentru partea interactivă */}
          <HamburgerMenu SideMenuItems={SideMenuItems} collections={collections} />

          {/* Logo-ul site-ului */}
          <div className="text-center">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase text-center ml-4 lg:ml-0"
              data-testid="nav-store-link"
            >
              LorenaLash
            </LocalizedClientLink>
          </div>

          {/* Elemente de navigare pentru cont și coș */}
          <div className="flex absolute lg:relative right-4 items-center gap-x-6 whitespace-nowrap inline">
            <LocalizedClientLink
              className="flex flex-row items-center gap-1 text-lg hover:text-ui-fg-base"
              href="/account"
              data-testid="nav-account-link"
            >
              <span className="text-[24px]">
                <RxAvatar />
              </span>
              <span className="hidden lg:block">Contul Meu</span> {/* Ascunde textul pe mobil */}
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base gap-1 hidden lg:block"
                  href="/cos"
                  data-testid="nav-cart-link"
                >
                  <span className="hidden lg:block">Cos (0)</span>
                </LocalizedClientLink>
              }
            >
              <div className="flex items-center gap-1">
                <CartButton />
                {/* Ascunde textul pe mobil */}
              </div>
            </Suspense>
          </div>
        </nav>

        {/* Elemente de navigare pentru desktop */}
        <ul className="hidden lg:flex gap-[16px] items-center justify-center gap-[24px] z-50">
          {/* Renderizare dinamică pentru meniul lateral */}
          {Object.entries(SideMenuItems).map(([name, href]) => {
            // Dropdown pentru Produse
            if (name === "Magazin") {
              return (
                <li key={name} className="relative group">
                  {/* Numai "Magazin" va activa dropdown-ul */}
                  <span className="text-lg leading-10 hover:text-ui-fg-disabled cursor-pointer">
                    {name}
                  </span>
                  {/* Dropdown pentru colecții */}
                  <ul className="absolute hidden group-hover:block bg-white border w-[200px]  p-4 shadow-lg z-999">
                    <li className="py-2">
                      <LocalizedClientLink
                        href={`/magazin`}
                        className="text-sm text-gray-700 hover:text-ui-fg-base"
                      >
                        TOATE PRODUSELE
                      </LocalizedClientLink>
                    </li>
                    {collections?.map((collection) => (
                      <li key={collection.id} className="py-2">
                        <LocalizedClientLink
                          href={`/collections/${collection.handle}`}
                          className="text-sm text-gray-700 hover:text-ui-fg-base"
                        >
                          {collection.title.toUpperCase()}
                        </LocalizedClientLink>
                      </li>
                    ))}
                  </ul>
                </li>
              )
            }

            // Dropdown pentru Cursuri Profesionale
            if (name === "Cursuri Profesionale") {
              return (
                <li key={name} className="relative group">
                  {/* Adăugăm link pe text pentru redirecționare */}
                  <LocalizedClientLink
                    href={href}
                    className="text-lg leading-10 hover:text-ui-fg-disabled cursor-pointer"
                  >
                    {name}
                  </LocalizedClientLink>
                  {/* Dropdown pentru cursuri */}
                  <ul className="absolute hidden group-hover:block bg-white border w-[200px]  p-4 shadow-lg z-999">
                    <li className="py-2">
                      <LocalizedClientLink
                        href={`/cursuri/curs-de-baza`}
                        className="text-sm text-gray-700 hover:text-ui-fg-base"
                      >
                        Curs de Bază
                      </LocalizedClientLink>
                    </li>
                    <li className="py-2">
                      <LocalizedClientLink
                        href={`/cursuri/curs-de-efecte-speciale`}
                        className="text-sm text-gray-700 hover:text-ui-fg-base"
                      >
                        Curs de Efecte Speciale
                      </LocalizedClientLink>
                    </li>
                    <li className="py-2">
                      <LocalizedClientLink
                        href={`/cursuri/curs-vip`}
                        className="text-sm text-gray-700 hover:text-ui-fg-base"
                      >
                        Curs VIP
                      </LocalizedClientLink>
                    </li>
                  </ul>
                </li>
              )
            }

            // Pentru restul elementelor din meniu
            return (
              <li key={name}>
                <LocalizedClientLink
                  href={href}
                  className="text-lg leading-10 hover:text-ui-fg-disabled"
                  data-testid={`${name.toLowerCase()}-link`}
                >
                  {name}
                </LocalizedClientLink>
              </li>
            )
          })}
        </ul>
      </header>
      <MovingText />
    </div>
  )
}
