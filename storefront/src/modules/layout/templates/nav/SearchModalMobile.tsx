import SearchForm from "./searchForm";


export default function SearchModalMobile ({setShowSearchModal}) {
    return(
        <div className="fixed left-0 flex justify-center items-center bg-white w-screen h-full">
            <SearchForm mobile={true} setShowSearchModal={(value)=>setShowSearchModal(value)} />
        </div>
    )
}