import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, List, ListItem, Drawer, Box, Grid } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ClothCard from './ClothCard';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [clothData, setClothData] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  useEffect(() => {
    if (selectedShop) {
      const jsonFiles = {
      'Outfitter': '/CSV Files/Lamare.json',
      'Lama': '/CSV Files/Lamare.json',
      'Attire': '/CSV Files/Attire.json',
      };

      if (selectedShop === 'View All') {
        const allClothData = [];
        const fetchJson = (file) =>
          fetch(file)
            .then((response) => response.json())
            .then((data) => data)
            .catch((error) => {
              console.error('Error fetching JSON files:', error);
            });

        Promise.all(Object.values(jsonFiles).map(fetchJson))
          .then((results) => {
            results.forEach((data) => {
              allClothData.push(...data);
            });
            console.log(allClothData);
            setClothData(allClothData);

          })
          .catch((error) => console.error('Error fetching JSON files:', error));
      }
      else {
        fetch(jsonFiles[selectedShop])
          .then((response) => response.json())
          .then((data) => {
            setClothData(data);
          })
          .catch((error) => {
            console.error('Error fetching JSON file:', error);
          });
      }
    }
  }, [selectedShop]);

  const handleShopClick = (shop) => {
    setSelectedShop(shop);
    setIsOpen(false);
  };

  return (
    <>
      <AppBar position="static" className="app-bar">
        <Toolbar className="toolbar">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            className="menu-icon"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" className="nav-title">
            Clothon
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List className="list">
            {['Outfitter', 'Lama', 'Attire', 'View All'].map((text, index) => (
              <ListItem button key={index} className="list-item" onClick={() => handleShopClick(text)}>
                <Typography variant="button">{text}</Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Grid container spacing={2} className="cards-container">
        {clothData.map((cloth, index) => (
          <Grid item key={index}>
            <ClothCard
              name={cloth.Name}
              price={cloth.Price}
              image={cloth.Image}
              link={cloth.Link}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default Navbar;
