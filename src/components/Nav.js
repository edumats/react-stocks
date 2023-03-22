import { useState, useEffect } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [value, setValue] = useState('/')
  const location = useLocation()

  useEffect(() => {
    setValue(location.pathname)
  }, [location])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
    return (
      <BottomNavigation showLabels value={value} onChange={handleChange}>
        <BottomNavigationAction
          component={Link}
          to="/"
          label="Portfolio"
          value="/"
          icon={<TrendingUpIcon />}
        />
        <BottomNavigationAction
         component={Link}
         to="/buy"
         label="Comprar"
         value="/buy"
         icon={<ShoppingCartIcon />}
        />
        <BottomNavigationAction
         component={Link}
         to="/sell"
         label="Vender"
         value="/sell"
         icon={<AttachMoneyIcon />}
         />
      </BottomNavigation>
    );
  }

export default Navbar;