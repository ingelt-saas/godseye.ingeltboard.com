import React from 'react';
import { Pagination } from '@mui/material';

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {

  const handlePageChange = (event, page) => {
    onPageChange(page);
  };

  return (
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={handlePageChange}
      variant="outlined"
      shape="rounded"
      sx={{
        
      }}
    />
  );
};

export default PaginationComponent;
