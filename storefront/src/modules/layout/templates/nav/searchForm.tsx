"use client" // this marks it as a client component

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function SearchForm() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // Handle the search form submission
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/results/${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      className="hidden lg:inline relative flex-1 w-[450px] mx-auto"
    >
      <input
        type="text"
        name="query"
        className="border border-gray-300 h-[40px] rounded-md p-3 w-full"
        placeholder="Caută produse..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        required
      />
      <button
        type="submit"
        className="absolute text-md right-2 top-3 text-gray-500 hover:text-gray-700"
      >
        <FaMagnifyingGlass />
      </button>
    </form>
  )
}
