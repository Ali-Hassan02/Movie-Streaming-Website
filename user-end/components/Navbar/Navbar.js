import { useState, useRef, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, InputBase, styled } from '@mui/material';
import { Menu as MenuIcon, BookmarkAdd, ExpandMore } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { Menu, MenuItem , IconButton} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const logoURL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/2560px-IMDB_Logo_2016.svg.png';

const StyledToolBar = styled(Toolbar)`
    background: #121212;
    min-height: 56px !important;
    padding: 0 115px !important;
    justify-content: space-between;
    & > * {
        padding: 0 16px;
    }
    & > div {
        display: flex;
        align-items: center;
        cursor: pointer;
        & > p {
            font-weight: 600;
            font-size: 14px;
        }
    }
    & > p {
        font-weight: 600;
        font-size: 14px;
    }
`;

const InputSearchField = styled(InputBase)`
    background: #FFFFFF;
    height: 30px;
    width: 55%;
    border-radius: 5px;
`;

const Logo = styled('img')({
    width: 100,  // adjust the width as desired
    height: 'auto',  // ensures aspect ratio is maintained
});




const Navbar = () => {
    
   
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [user , setUser] = useState(null)
    

    useEffect(() => {
        fetch("/api/getToken").then(res => res.json()).then(data => {
            
            setUser(data.user)
        });
       
      }, []);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget); // Open the dropdown menu
      };
    
    const handleClose = () => {
    setAnchorEl(null); // Close the dropdown menu
    };
    
    const handleLogout = async() => {
        try {
            const response = await fetch('/api/clearToken', { method: 'POST' });
            if (response.ok) {
              // Redirect to home page or login page after logout
              setUser(null)
              router.push('/')
              window.location.reload();
            }
          } catch (error) {
            console.error('Error during logout:', error);
          }
    };

    // Handle menu toggle
    const handleToggle = (event) => {
      setAnchorEl(event.currentTarget);
      setOpen((prev) => !prev);
    };
    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        // Update the query in the router
        router.push({
            pathname: '/search',
            query: { query: value },
        });
        if(value === ''){
            router.push('/');
        }
    };
    
    const handleLogoClick = () => {
        router.push('/');
    };

    const handleNavigate = () => {
        router.push('/FavouriteList'); // Navigate to the FavouriteList page
      };


    return (
        <AppBar style={{ minHeight: 56 }} position="fixed">
            <StyledToolBar>
                <Logo src={logoURL} alt="logo" onClick={handleLogoClick} />
                
                <InputSearchField 
                    variant="outlined" 
                    value={searchTerm} 
                    onChange={handleSearchChange}  
                    placeholder="Search for movies, TV shows, celebrities, and more" 
                  
                />
                
                <Box onClick={handleNavigate}>
                    <BookmarkAdd />
                    <Typography>Watchlist</Typography>
                </Box>
                {!user ? <Typography onClick={()=>router.push('/login')}>Login</Typography> : 
                
                <div className="flex items-center space-x-2">
                    {/* User icon and username */}
                    <IconButton onClick={handleClick}>
                    <AccountCircleIcon className="text-yellow-500 text-2xl" />

                    </IconButton>
                    <Typography>{user.username}</Typography>
                    
                    {/* Dropdown menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                    </div>
        }
                
                
            </StyledToolBar>
        </AppBar>
    );
};

export default Navbar;
