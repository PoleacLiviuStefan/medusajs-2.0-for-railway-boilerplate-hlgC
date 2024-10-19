'use client'

import React, { useState } from "react"
import { FiMenu, FiX } from "react-icons/fi"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Definim tipul pentru SideMenuItems
type SideMenuItemsType = {
  [key: string]: string
}

export default function HamburgerMenu({ SideMenuItems }: { SideMenuItems: SideMenuItemsType }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Buton hamburger pentru mobil */}
      <button
        className="lg:hidden text-2xl z-50 fixed top-4 left-4" // Setăm z-index mare și poziționăm butonul astfel încât să fie deasupra overlay-ului
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Overlay negru cu opacitate */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Meniu lateral pentru mobil */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-[300px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative w-full flex items-center justify-center p-8">
          <span className="text-[24px] font-bold">Lorena Lash</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[16px] border-[1px] border-gray-400 p-[4px]"
          >
            <FiX />
          </button>
        </div>

        <ul className="p-4 mt-[20px]">
          {Object.entries(SideMenuItems).map(([name, href]) => (
            <li key={name} className="relative py-2 text-black">
              <LocalizedClientLink
                href={href}
                className="text-[16px] leading-10 hover:text-ui-fg-base"
                onClick={() => setMenuOpen(false)} // Închide meniul după click
              >
                {name}
              </LocalizedClientLink>
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gray-200 " />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
