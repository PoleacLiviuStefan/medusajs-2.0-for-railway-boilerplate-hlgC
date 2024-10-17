import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import { getCollectionsList } from "@lib/data/collections"
import { RxAvatar } from "react-icons/rx"
import { MdOutlineShoppingCart } from "react-icons/md";
import HamburgerMenu from "./HamburgerMenu"
import MovingText from "./MovingText"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  const { collections } = await getCollectionsList()

  const SideMenuItems = {
    Magazin: "/",
    Cursuri: "/cursuri",
    "Despre Noi": "/despre-noi",
    Contact: "/contact",
    "Cursuri Profesionale": "/cursuri",
  }

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className=" flex flex-col justify-center relative h-[50px] lg:h-[80px] mx-auto  border-b duration-200 bg-white border-ui-border-base ">
        <nav className="flex justify-center lg:justify-between content-container txt-xsmall-plus text-ui-fg-subtle items-center  w-full mt-[8px] gap-[8px] px-4 py-2 lg:w-[900px] lg:px-0">
          {/* Adăugăm componenta HamburgerMenu pentru partea interactivă */}
          <HamburgerMenu SideMenuItems={SideMenuItems} />

          {/* Logo-ul site-ului */}
          <div className=" text-center">
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
              <span className="text-[24px]"><RxAvatar /></span>
              <span className="hidden lg:block">Contul Meu</span> {/* Ascunde textul pe mobil */}
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base  gap-1 hidden lg:block"
                  href="/cart"
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
        <ul className="hidden lg:flex gap-[16px] items-center justify-center gap-[24px] ">
          {Object.entries(SideMenuItems).map(([name, href]) => (
            <li key={name}>
              <LocalizedClientLink
                href={href}
                className="text-lg leading-10 hover:text-ui-fg-disabled"
                data-testid={`${name.toLowerCase()}-link`}
              >
                {name}
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      </header>
      <MovingText />
    </div>
  )
}
