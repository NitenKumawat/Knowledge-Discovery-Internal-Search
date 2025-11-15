import React, { useState } from 'react'
import SearchBar from './components/SearchBar'
import ResultsList from './components/ResultsList'
import FileUploader from './components/FileUploader'


export default function App() {
const [query, setQuery] = useState('')
const [results, setResults] = useState(null)


return (
<div className="min-h-screen bg-slate-50 p-6">
<header className="max-w-5xl mx-auto">
<h1 className="text-3xl font-bold mb-4">Knowledge Discovery — Internal Search</h1>
<p className="text-sm text-slate-600 mb-6">Fast search across marketing docs and assets.</p>
</header>


<main className="max-w-5xl mx-auto space-y-6">
    <div className="">
<FileUploader />
</div>
<div className="flex gap-4 items-start">


</div>


 <SearchBar onResults={setResults} />
      <ResultsList results={results} />
</main>
</div>
)
}