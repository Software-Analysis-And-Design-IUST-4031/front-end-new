import React, { useState } from 'react';
import './Paitings.css';
import Filter from './filter';
import PostCard from '../../userpanel/Card';

// Sample data with actual image paths that exist in your project
const samplePosts = [
    {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
        caption: 'A stunning piece by Van Gogh',
        title: 'Starry Night',
        price: '5000',
        likes: 24,
        isLiked: false,
        isSaved: false,
        createdAt: new Date().toISOString(),
        artist: 'Van Gogh',
        year: 1889,
        style: 'Post-Impressionism'
    },
    {
        id: '2',
        imageUrl: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8',
        caption: 'The enigmatic smile',
        title: 'Mona Lisa',
        price: '10000',
        likes: 18,
        isLiked: false,
        isSaved: false,
        createdAt: new Date().toISOString(),
        artist: 'Da Vinci',
        year: 1503,
        style: 'Renaissance'
    },
    {
        id: '3',
        imageUrl: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5',
        caption: 'Surrealist masterpiece',
        title: 'The Persistence of Memory',
        price: '7000',
        likes: 32,
        isLiked: false,
        isSaved: false,
        createdAt: new Date().toISOString(),
        artist: 'Dali',
        year: 1931,
        style: 'Surrealism'
    }
];

const Paintings: React.FC = () => {
    const [filters, setFilters] = useState({ style: '', artist: '', year: '', search: '' });
    const [posts, setPosts] = useState(samplePosts);

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);

        const filtered = samplePosts.filter((post) => {
            const matchesStyle = !newFilters.style || post.style === newFilters.style;
            const matchesArtist = !newFilters.artist || post.artist === newFilters.artist;
            const matchesYear = !newFilters.year || post.year.toString() === newFilters.year;
            const matchesSearch =
                !newFilters.search ||
                post.title.toLowerCase().includes(newFilters.search.toLowerCase()) ||
                post.artist.toLowerCase().includes(newFilters.search.toLowerCase());

            return matchesStyle && matchesArtist && matchesYear && matchesSearch;
        });

        setPosts(filtered);
    };

    const handleLike = (id: string) => {
        setPosts(posts.map(post => 
            post.id === id 
                ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
                : post
        ));
    };

    const handleSave = (id: string) => {
        setPosts(posts.map(post => 
            post.id === id ? { ...post, isSaved: !post.isSaved } : post
        ));
    };

    const handleShare = (id: string) => {
        // Implement share functionality
        console.log('Sharing post:', id);
    };

    return (
        <section className="paintings-section">
            <h2>Paintings</h2>

            <Filter filters={filters} handleFilterChange={handleFilterChange} mockPaintings={samplePosts} />

            <div className="paintings-grid">
                <PostCard 
                    posts={posts}
                    onLike={handleLike}
                    onSave={handleSave}
                    onShare={handleShare}
                />
            </div>
        </section>
    );
};

export default Paintings;
