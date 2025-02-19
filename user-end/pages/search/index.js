import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AllCards from "@/components/AllCards/AllCards";
import Navbar from '@/components/Navbar/Navbar';

const Search = () => {
    const router = useRouter();
    const { query } = router.query; // Get the query parameter from the URL
    
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);

    // Fetch movies from the API
    useEffect(() => {
        fetch('/api/movie')
            .then((res) => res.json())
            .then((data) => {
                console.log('Movies fetched:', data);
                setMovies(data);
            })
            .catch((err) => console.error('Error fetching movies:', err));
    }, []);

    // Filter movies based on the search query
    useEffect(() => {
        if (movies.length > 0 && query) { // Ensure movies are loaded and query exists
            const lowerCaseQuery = query.toLowerCase();
            const results = movies.filter((movie) => {
                return (
                    movie.title.toLowerCase().includes(lowerCaseQuery) ||
                    (movie.description && movie.description.toLowerCase().includes(lowerCaseQuery))
                );
            });
            console.log('Filtered results:', results);
            setFilteredMovies(results);
        }
    }, [movies, query]); // Add `query` as a dependency to re-filter when the query changes

    if (!query) {
        return (
            <div>
                <h1 className="text-4xl font-bold text-white py-5 px-8 bg-black-800 rounded-lg mx-auto shadow-lg w-fit mt-10">
                    No Search Query Provided
                </h1>
            </div>
        );
    }

    return (
        <>
            <div>
                <h1 className="text-4xl font-bold text-white py-5 px-8 bg-black-800 rounded-lg mx-auto shadow-lg w-fit mt-10">
                    Search Results
                </h1>
                <AllCards mov={filteredMovies} title="" delete_btn={false} />
            </div>
        </>
    );
};

export default Search;
