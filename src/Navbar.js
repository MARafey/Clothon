import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, List, ListItem, Drawer, Box, Grid, Pagination, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ClothCard from './ClothCard';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [clothData, setClothData] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('');
  const itemsPerPage = 28;

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  useEffect((e) => {
    if (selectedShop) {
      // Clearing the card data when the shop is changed

        setClothData([]);

      const jsonFiles = {
        'Saphire': '/CSV Files/Saphire.json',
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
      } else {
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
    setPage(1);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const sortedAndPaginatedData = () => {
    let sortedData = [...clothData];
    if (sortOrder === 'highToLow') {
      sortedData.sort((a, b) => parseFloat(b.Price) - parseFloat(a.Price));
    } else if (sortOrder === 'lowToHigh') {
      sortedData.sort((a, b) => parseFloat(a.Price) - parseFloat(b.Price));
    }
    const startIndex = (page - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
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
          <FormControl variant="outlined" style={{ minWidth: 120, marginLeft: 'auto' }}>
            <InputLabel>Sort by Price</InputLabel>
            <Select
              value={sortOrder}
              onChange={handleSortChange}
              label="Sort by Price"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="highToLow">High to Low</MenuItem>
              <MenuItem value="lowToHigh">Low to High</MenuItem>
            </Select>
          </FormControl>
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
            {['Saphire', 'Lama', 'Attire', 'View All'].map((text, index) => (
              <ListItem button key={index} className="list-item" onClick={() => handleShopClick(text)}>
                <Typography variant="button">{text}</Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Grid container spacing={2} className="cards-container">
        {sortedAndPaginatedData().map((cloth, index) => (
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
      <Box display="flex" justifyContent="center" mt={3} mb={3}>
        <Pagination
          count={Math.ceil(clothData.length / itemsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>
    </>
  );
}

export default Navbar;