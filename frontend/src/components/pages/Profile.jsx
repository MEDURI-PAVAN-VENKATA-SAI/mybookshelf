import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Heart, Upload } from 'lucide-react';
import Button from '../utils/Button';
import CardCarousel from '../utils/CardCarousel';
import { useUser } from '../contexts/UserContext';
import SafeImage from '../utils/SafeImage';
import TabCarousel from '../utils/TabCarousel';

const uploadedBooks = [
  {
    id: '101',
    title: 'My Personal Journal',
    author: 'You',
    rating: 5.0
  },
  {
    id: '102',
    title: 'Research Notes',
    author: 'You',
    rating: 4.5
  }
];

const favoriteBooks = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5
  },
  {
    id: '5',
    title: 'Dune',
    author: 'Frank Herbert',
    coverUrl: 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6
  }
];

const progressBooks = [
  { id:1, 
    name:"The Midnight Library", 
    author:"Matt Haig", 
    currentpage:65, 
    totalpages:100, 
    progress: (65 * 100 / 100).toFixed(0)
  },
  { id:2, 
    name:"Atomic Habits", 
    author:"James Clear", 
    currentpage:32, 
    totalpages:111, 
    progress: (32 * 100 / 111).toFixed(0)
  }
] 

export default function Profile() {
  const [activeTab, setActiveTab] = useState('uploads');
  const { user } = useUser();
  const navigate = useNavigate();

  const [readCount, setReadCount] = useState(5);
  const [uploadCount, setUploadCount] = useState(uploadedBooks.length | 0);
  const [favouriteCount, setFavouriteCount] = useState(favoriteBooks.length | 0);

  const progressTabData = (books) => {
    return(
      <div>
        <h2 className="text-2xl font-bold text-[var(--text)] mb-6"> Reading Progress </h2>
        <div className="space-y-4">
          {books.map((book) => (
            <div key={book.id} className="bg-[var(--secondary)] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-[var(--text)]">
                    {book.name}
                  </h3>
                  <p className="text-sm text-[var(--muted-text)]">{book.author}</p>
                </div>
                <span className="text-sm font-medium text-[var(--accent)]">
                  {book.progress}%
                </span>
              </div>
              <div className="w-full bg-[var(--secondary)] rounded-full h-2">
                <div className="bg-[var(--accent)] h-2 rounded-full" style={{ width: `${book.progress}%`}} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const [userAnalytics, SetUserAnalytics] = useState([
    { id:"completed", title:"Books Read", icon: <Book className="w-5 h-5 text-[var(--accent)]" />, count: 0 },
    { id:"uploads", title:"Uploads", icon: <Upload className="w-5 h-5 text-green-500" />, count: uploadedBooks.length },
    { id:"favourites", title:"Favourites", icon: <Heart className="w-5 h-5 text-red-500" />, count: favoriteBooks.length }
  ]);

  const tabs = [  
    {id:"uploads", title:"My Uploads", icon: <Upload size={20}/>, dataTab: <CardCarousel title={"My Uploads"} books={uploadedBooks}/> },                   
    {id:"favourites", title:"Favourites", icon: <Heart size={20}/>, dataTab: <CardCarousel title={"Favourite Books"} books={favoriteBooks}/> },                  
    {id:"progress", title:"Reading Progress", icon: <Book size={20}/>, dataTab: progressTabData(progressBooks) }
  ];
  

  return (
    <div className="w-full h-full bg-transparent py-4 sm:p-4 overflow-x-hidden overflow-y-auto scrollbar-auto">
          <div className="bg-[var(--background)] rounded-2xl shadow-xl overflow-auto max-sm:mx-4 mb-4">
            <div className="h-32 bg-[url('/rack.jpg')] bg-contain bg-repeat-x"/>

            <div className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
                <div className="w-32 h-32 bg-[var(--background)] rounded-full shadow-xl flex items-center justify-center border-4 border-[var(--border)]">
                  <SafeImage src={user.picture} fallback="/profile.png" className={`w-full h-full rounded-full text-[var(--muted-text)] ${user.picture ? "" : "p-3"}`} />
                </div>

                <div className="flex-1">
                  <h4 className="text-xl sm:text-2xl font-bold text-[var(--text)] mb-1 line-clamp-1"> {user.username} </h4>
                  <p className="text-[var(--muted-text)]">{user.email}</p>                 
                </div>

                <Button variant='primary' onClick={() => navigate("/app/account")}> Edit Profile </Button>
              </div>

              <div className={`grid grid-cols-2 ${"md:grid-cols-" + userAnalytics.length} gap-4 mt-8`}>
                {userAnalytics.map((a) =>( 
                  <div key={a.id} className="bg-[var(--secondary)] rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      {a.icon}
                      <span className="text-sm text-[var(--muted-text)]">{a.title}</span>
                    </div>
                    <p className="pl-8 text-2xl font-bold text-[var(--text)]">{a.count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[var(--background)] sm:rounded-2xl shadow-xl px-2 py-8 sm:p-8 w-[100%] h-fit overflow-hidden">
            <div className="border-b border-[var(--border)] mb-8">
              <TabCarousel tabs={tabs} selectedTab={activeTab} setSelectedTab={setActiveTab} className="relative"
                primaryStyle="bg-[var(--primary)] text-[var(--primary-text)]"
              />                            
            </div>

            { tabs.map((tab) => ( activeTab === tab.id && (<div key={tab.id}> {tab.dataTab} </div> )))}

          </div>
    </div>
  );
}
